import cv2
import numpy as np
import tensorflow as tf
import mediapipe as mp
import time
import modules.holistic_module as hm
from modules.utils import Vector_Normalization

# 설정
actions = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
        'ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ',
        'ㅐ', 'ㅒ', 'ㅔ', 'ㅖ', 'ㅢ', 'ㅚ', 'ㅟ']
seq_length = 10

# 모듈 내부 상태 변수
_current_question = None
_game_result = None
_question_time = 0  # 문제가 제시된 시간
_min_confidence = 0.9  # 최소 신뢰도 임계값
_warm_up_time = 3  # 문제 제시 후 판별 시작까지의 대기 시간(초)

# 상태 접근 함수
def set_game_state(question, result):
    global _current_question, _game_result, _question_time
    _current_question = question
    _game_result = result
    _question_time = time.time()

def get_game_state():
    return _current_question, _game_result

# 모델 및 MediaPipe 초기화
detector = hm.HolisticDetector(min_detection_confidence=0.3)
interpreter = tf.lite.Interpreter(model_path="multi_hand_gesture_classifier.tflite")
interpreter.allocate_tensors()

# 입력 및 출력 정보
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# 카메라 및 시퀀스 저장 리스트
cap = None
seq = []
action_seq = []
is_recognizing = False

def generate_frames():
    """카메라 프레임을 스트리밍하는 함수"""
    global cap, seq, action_seq, is_recognizing, _current_question, _game_result, _question_time
    
    if cap is None or not cap.isOpened():
        cap = cv2.VideoCapture(0)
    
    seq = []
    action_seq = []
    is_recognizing = True
    last_prediction_time = 0
    prediction_cooldown = 1.0

    while is_recognizing:
        ret, img = cap.read()
        if not ret:
            break

        img = cv2.flip(img, 1)
        img = detector.findHolistic(img, draw=True)
        _, right_hand_lmList = detector.findLefthandLandmark(img)

        current_time = time.time()
        elapsed_since_question = current_time - _question_time
        ready_to_predict = elapsed_since_question >= _warm_up_time

        if right_hand_lmList is not None:
            joint = np.zeros((42, 2))
            for j, lm in enumerate(right_hand_lmList.landmark):
                joint[j] = [lm.x, lm.y]
            
            vector, angle_label = Vector_Normalization(joint)
            d = np.concatenate([vector.flatten(), angle_label.flatten()])
            seq.append(d)
            
            if len(seq) > seq_length:
                seq.pop(0)

            if (ready_to_predict and 
                len(seq) == seq_length and 
                current_time - last_prediction_time >= prediction_cooldown):
                
                input_data = np.expand_dims(np.array(seq), axis=0).astype(np.float32)
                interpreter.set_tensor(input_details[0]['index'], input_data)
                interpreter.invoke()
                y_pred = interpreter.get_tensor(output_details[0]['index'])
                i_pred = int(np.argmax(y_pred))
                confidence = y_pred[0][i_pred]
                
                if confidence > _min_confidence:
                    action = actions[i_pred]
                    action_seq.append(action)
                    
                    if len(action_seq) >= 3 and action_seq[-1] == action_seq[-2] == action_seq[-3]:
                        predicted_action = action
                        
                        if _current_question:
                            if predicted_action == _current_question:
                                _game_result = "정답입니다!"
                            else:
                                _game_result = "틀렸습니다!"
                        else:
                            _game_result = "문제가 출제되지 않았습니다."
                        
                        last_prediction_time = current_time
                        action_seq = []

        _, buffer = cv2.imencode('.jpg', img)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    if cap is not None and cap.isOpened():
        cap.release()
