from flask import Flask, render_template, Response, jsonify
import random
from game1 import generate_frames as generate_frames_game1, actions as actions_game1, set_game_state as set_game1_state, get_game_state as get_game1_state,get_confidence_score
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

# 카메라 설정
# @app.route('/game1_1')
# def game1():
#     return Response(generate_frames(target_width=480, target_height=640), mimetype='multipart/x-mixed-replace; boundary=frame')

# @app.route('/game2_2')
# def game2():
#     return Response(generate_frames(target_width=1280, target_height=720), mimetype='multipart/x-mixed-replace; boundary=frame')

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

# @app.route('/game1/get_confidence', methods=['GET'])  # 🔧 추가
# def game1_get_confidence():
#     confidence = get_confidence_score()
#     return jsonify({"confidence": confidence})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)