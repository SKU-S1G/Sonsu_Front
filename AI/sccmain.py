from flask import Flask, Response, jsonify, request
import random
import pymysql
import cv2
from flask_cors import CORS
from scc import CameraManager, InferenceEngine

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

camera = CameraManager()
inference = InferenceEngine()

@app.route('/get_question', methods=['GET'])
def game1_get_question():
    question = random.choice(inference.actions)
    inference.set_question(question)
    return jsonify({"question": question})

@app.route('/get_game_info', methods=['GET'])
def game1_get_game_info():
    question, result, confidence = inference.get_state()
    
    question = str(question) if question is not None else None
    result = str(result) if result is not None else None
    confidence = float(confidence) if confidence is not None else 0.0

    return jsonify({
        "question": question,
        "game_result": result,
        "confidence": confidence
    })


@app.route('/save_incorrect', methods=['POST'])
def save_result():
    data = request.json
    user_id = data.get('user_id')
    question = data.get('question')  # 단일 문제
    confidence = data.get('confidence')  # 단일 신뢰도
    
    # 필수 데이터 검증
    if not user_id or not question:
        return jsonify({
            "status": "error", 
            "message": f"필수 데이터 누락: user_id={user_id}, question={question}"
        }), 400
    
    try:
        conn = pymysql.connect(
            host='database-sonsu.c3gig4u4qamm.ap-northeast-2.rds.amazonaws.com',
            user='user',
            password='useruser',
            db='db_sonsu',
            charset='utf8'
        )
        
        with conn.cursor() as cursor:
            # confidence를 퍼센트로 변환 (문서 코드와 동일하게)
            check_accuracy = int(confidence * 100) if confidence is not None else 0
            
            sql = """
                INSERT INTO games (user_id, check_answer, check_accuracy)
                VALUES (%s, %s, %s)
            """
            cursor.execute(sql, (user_id, question, check_accuracy))
        
        conn.commit()
        print(f"저장 완료: user_id={user_id}, question={question}, accuracy={check_accuracy}%")
        return jsonify({"status": "success"})
        
    except Exception as e:
        print("DB 저장 실패:", e)
        return jsonify({"status": "error", "message": str(e)})
    finally:
        if 'conn' in locals():
            conn.close()

def generate_frames_game1(target_width=480, target_height=480):
    while True:
        frame = camera.get_frame()
        if frame is None:
            continue
        inference.process_frame(frame)
        frame = cv2.resize(frame, (target_width, target_height))
        _, buffer = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.route('/video_feed')
def game1_video_feed():
    return Response(generate_frames_game1(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/get_confidence')
def get_confidence_route():
    return jsonify({'confidence': inference.confidence_value})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
