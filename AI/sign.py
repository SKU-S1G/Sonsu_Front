import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf
from PIL import ImageFont, ImageDraw, Image
import requests  # API 호출을 위한 requests 라이브러리 추가

# 모델 및 데이터 정보
model_path = 'model.tflite'  # TFLite 모델 경로
actions = ['안녕하세요', '사랑합니다', '감사합니다']  # 학습한 동작 리스트
seq_length = 30  # 모델 학습 시 사용한 시퀀스 길이

# 한글 폰트 설정
font_path = "malgun.ttf"  # 또는 "NanumGothic.ttf"
font = ImageFont.truetype(font_path, 30)

# TFLite 모델 로드
interpreter = tf.lite.Interpreter(model_path=model_path)
interpreter.allocate_tensors()

# 입력 및 출력 텐서 정보 가져오기
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# MediaPipe 모델 로드
mp_holistic = mp.solutions.holistic
mp_drawing = mp.solutions.drawing_utils
holistic = mp_holistic.Holistic(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

cap = cv2.VideoCapture(0)
seq = []  # 시퀀스 데이터 저장 리스트

def draw_text(img, text, position, font, color=(0, 255, 0)):
    """PIL을 이용해 한글을 출력하는 함수"""
    img_pil = Image.fromarray(img)
    draw = ImageDraw.Draw(img_pil)
    draw.text(position, text, font=font, fill=color)
    return np.array(img_pil)

def send_prediction_to_api(prediction, confidence):
    """예측 결과를 API로 전송하는 함수"""
    api_url = "http://example.com/predict"  # 실제 API URL로 변경
    payload = {
        "predicted_action": prediction,
        "confidence": confidence
    }
    response = requests.post(api_url, json=payload)
    return response.json()

while cap.isOpened():
    ret, img = cap.read()
    if not ret:
        break

    img = cv2.flip(img, 1)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    result = holistic.process(img_rgb)

    joint_list = []

    # 왼손 랜드마크 저장
    if result.left_hand_landmarks:
        for lm in result.left_hand_landmarks.landmark:
            joint_list.append([lm.x, lm.y, lm.z])
    else:
        joint_list.extend([[0, 0, 0]] * 21)

    # 오른손 랜드마크 저장
    if result.right_hand_landmarks:
        for lm in result.right_hand_landmarks.landmark:
            joint_list.append([lm.x, lm.y, lm.z])
    else:
        joint_list.extend([[0, 0, 0]] * 21)

    # 몸(상체) 랜드마크 저장
    if result.pose_landmarks:
        for lm in result.pose_landmarks.landmark:
            joint_list.append([lm.x, lm.y, lm.z])
    else:
        joint_list.extend([[0, 0, 0]] * 33)

    if joint_list:
        joint_list = np.array(joint_list).flatten()
        seq.append(joint_list)

        # 시퀀스 길이 유지
        if len(seq) > seq_length:
            seq.pop(0)

        # 예측 수행 (TFLite 모델 사용)
        if len(seq) == seq_length:
            input_data = np.expand_dims(np.array(seq), axis=0).astype(np.float32)

            interpreter.set_tensor(input_details[0]['index'], input_data)
            interpreter.invoke()
            prediction = interpreter.get_tensor(output_details[0]['index'])[0]

            predicted_action = actions[np.argmax(prediction)]
            confidence = np.max(prediction)

            # 한글 예측 결과를 이미지에 표시 (화면 밖으로 위치 이동)
            img = draw_text(img, f'{predicted_action} ({confidence:.2f})', (img.shape[1] + 10, 50), font)

            # 예측 결과를 API로 전송
            api_response = send_prediction_to_api(predicted_action, confidence)
            print("API Response:", api_response)

    # 랜드마크 그리기
    mp_drawing.draw_landmarks(img, result.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS)
    mp_drawing.draw_landmarks(img, result.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS)
    mp_drawing.draw_landmarks(img, result.pose_landmarks, mp_holistic.POSE_CONNECTIONS)

    cv2.imshow('Sign Language Recognition', img)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
