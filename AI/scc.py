import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf
import time

# 카메라 관리 클래스
class CameraManager:
    def __init__(self, width=640, height=480):
        self.cap = cv2.VideoCapture(0)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)

    def get_frame(self):
        if not self.cap.isOpened():
            return None
        ret, frame = self.cap.read()
        if not ret:
            return None
        return cv2.flip(frame, 1)

    def release(self):
        if self.cap.isOpened():
            self.cap.release()

# 추론 엔진 클래스
class InferenceEngine:
    def __init__(self, model_path="final.tflite", seq_length=30, min_conf=0.8):
        self.actions = [
            '안녕하세요', '감사합니다', '사랑합니다', '어머니', '아버지', '동생', '잘', '못', '간다', '나',
            '이름', '만나다', '반갑다', '부탁', '학교', '생일', '월', '일', '나이', '복습', '학습', '눈치', '오다', '말', '곱다',
        ]
        self.seq_length = seq_length
        self.min_conf = min_conf

        # TFLite 모델 로드
        self.interpreter = tf.lite.Interpreter(model_path=model_path)
        self.interpreter.allocate_tensors()
        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()

        # Mediapipe Holistic
        self.mp_holistic = mp.solutions.holistic
        self.holistic = self.mp_holistic.Holistic(
            min_detection_confidence=0.5, min_tracking_confidence=0.5
        )

        # 상태 관리
        self.seq = []
        self.last_prediction_time = 0
        self.prediction_cooldown = 1.0
        self.current_question = None
        self.game_result = None
        self.confidence_value = None

    def set_question(self, question):
        self.current_question = question
        self.game_result = None

    def get_state(self):
        return self.current_question, self.game_result, self.confidence_value

    def process_frame(self, frame):
        if frame is None:
            return None, None

        img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = self.holistic.process(img_rgb)

        joint_list = []
        if result.left_hand_landmarks:
            joint_list.extend([[lm.x, lm.y, lm.z] for lm in result.left_hand_landmarks.landmark])
        else:
            joint_list.extend([[0,0,0]]*21)

        if result.right_hand_landmarks:
            joint_list.extend([[lm.x, lm.y, lm.z] for lm in result.right_hand_landmarks.landmark])
        else:
            joint_list.extend([[0,0,0]]*21)

        if result.pose_landmarks:
            joint_list.extend([[lm.x, lm.y, lm.z] for lm in result.pose_landmarks.landmark])
        else:
            joint_list.extend([[0,0,0]]*33)

        if not joint_list:
            return None, None

        joint_list = np.array(joint_list).flatten()
        self.seq.append(joint_list)
        if len(self.seq) > self.seq_length:
            self.seq.pop(0)

        current_time = time.time()
        if len(self.seq) == self.seq_length and (current_time - self.last_prediction_time >= self.prediction_cooldown):
            input_data = np.expand_dims(np.array(self.seq), axis=0).astype(np.float32)
            self.interpreter.set_tensor(self.input_details[0]['index'], input_data)
            self.interpreter.invoke()
            prediction = self.interpreter.get_tensor(self.output_details[0]['index'])[0]

            predicted_action = self.actions[np.argmax(prediction)]
            confidence = np.max(prediction)
            self.confidence_value = confidence

            if confidence >= self.min_conf:
                if self.current_question:
                    if predicted_action == self.current_question:
                        self.game_result = "정답입니다!"
                    else:
                        self.game_result = "틀렸습니다!"
                else:
                    self.game_result = "문제가 출제되지 않았습니다."
                self.last_prediction_time = current_time

            return predicted_action, confidence

        return None, None
