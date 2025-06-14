from flask import Flask, render_template, Response, jsonify
import random
import pymysql
from game1 import generate_frames as generate_frames_game1, actions as actions_game1, set_game_state as set_game1_state, get_game_state as get_game1_state, get_confidence
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# 메인 라우트
@app.route('/')
def index():
    return render_template('game1.html')  # 기본 페이지로 game1.html을 사용

# 게임 결과 저장 라우트
@app.route('/game1/save_result', methods=['POST'])
def save_result():
    data = request.json
    user_id = data.get('user_id')
    user_lesson_id = data.get('userLesson_id')
    confidence = data.get('confidence')
    result = data.get('result')  # "정답" 또는 "오답"

    # Boolean 변환
    check_answer = True if result == "정답" else False
    check_accuracy = int(confidence * 100)  # float → 정수로 변환 (예: 0.87 → 87)

    try:
        conn = pymysql.connect(
            host='database-sonsu.c3gig4u4qamm.ap-northeast-2.rds.amazonaws.com',
            user='user',
            password='useruser',
            db='db_sonsu',
            charset='utf8'
        )
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO games (userLesson_id, user_id, check_answer, check_accuracy)
                VALUES (%s, %s, %s, %s)
            """
            cursor.execute(sql, (user_lesson_id, user_id, check_answer, check_accuracy))
        conn.commit()
        return jsonify({"status": "success"})
    except Exception as e:
        print("DB 저장 실패:", e)
        return jsonify({"status": "error", "message": str(e)})
    finally:
        conn.close()

# 게임 1 라우트
@app.route('/game1')
def game1_index():
    return render_template('game1.html')

@app.route('/game1/get_question', methods=['GET'])
def game1_get_question():
    question = random.choice(actions_game1)
    # game1 모듈에 상태 전달
    set_game1_state(question, None)
    return jsonify({"question": question})

@app.route('/game1/get_game_info', methods=['GET'])
def game1_get_game_info():
    # game1 모듈에서 상태 가져오기
    question, result = get_game1_state()
    return jsonify({"question": question, "game_result": result})

@app.route('/game1/video_feed')
def game1_video_feed():
    return Response(generate_frames_game1(target_width=480, target_height=480),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/game1/get_confidence')
def get_confidence_route():
    return jsonify({'confidence': get_confidence()})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)