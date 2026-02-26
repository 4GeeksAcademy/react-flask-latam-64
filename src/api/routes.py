"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Favorites, FavoriteType, BlockedToken
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask_bcrypt import Bcrypt


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

app = Flask(__name__)
bcrypt = Bcrypt(app)


@api.route('/hello', methods=['GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route("/register", methods=['POST'])
def user_register():
    body = request.get_json()
    username = body["username"]
    password = body["password"]
    secure_password = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(username=username,
                    password=secure_password, is_active=True)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Usuario creado con exito"}), 201


@api.route("/login", methods=['POST'])
def user_login():
    # Obtenemos el username y la clave que envia el usuario
    body = request.get_json()
    username = body["username"]
    password = body["password"]

    # Se busca el username en la tabla de usuarios para validar que exista
    user = User.query.filter_by(username=username).first()

    # Mensaje de error si el usuario no fue encontrado
    if user is None:
        return jsonify({"error": "Usuario no encontrado"}), 401

    # Validar la contraseña ya que el usuario fue encontrado
    is_valid_password = bcrypt.check_password_hash(user.password, password)
    if not is_valid_password:
        return jsonify({"error": "Clave inválida"}), 401

    custom_claims = {"role": "user"}
    # Si todo está válido, se genera el token y se envia como respuesta
    token = create_access_token(identity=str(
        user.id), additional_claims=custom_claims)
    return jsonify({"message": "Login successfull", "token": token})


@api.route("/logout", methods=['POST'])
@jwt_required()
def user_logout():
    jti = get_jwt()['jti']
    blocked = BlockedToken(jti=jti)
    db.session.add(blocked)
    db.session.commit()
    return jsonify({"message": "Sesion cerrada"})


@api.route('/user/all', methods=['GET'])
@jwt_required()
def get_user_list():
    token_body = get_jwt()
    role = token_body["role"]
    if token_body["role"] is None:
        return jsonify({"error": "Sin role"}), 403

    if not role == "admin":
        return jsonify({"error": "Acceso denegado "}), 403
    users_db = User.query.all()
    users_dic = list(map(lambda u: u.serialize(), users_db))
    return jsonify(users_dic), 200


@api.route("/user", methods=['GET'])
@jwt_required()
def get_user_by_id():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user is None:
        return "User not found", 404

    return jsonify(user.serialize_with_favorites())


@api.route("/user", methods=['POST'])
def create_user():
    body = request.get_json()
    if (body["username"] is None):
        return jsonify({"error": "Username is required"}), 400

    try:
        new_user = User(username=body["username"],
                        password="123456", is_active=True)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created"}), 201
    except Exception as ex:
        print(ex)
        return jsonify({"error": "Error on user create"}), 400


@api.route("/favorites/", methods=['POST'])
@jwt_required()
def create_user_favorite():
    user_id = get_jwt_identity()
    body = request.get_json()
    # Validación de campos obligatorios
    if ("type" not in body):
        return jsonify({"error": "Favorite type is required"}), 400
    if ("favorite_id" not in body):
        return jsonify({"error": "Favorite ID is required"}), 400
    # Validación de tipos de favoritos
    favorite_type = None
    if (body["type"] == "planet"):
        favorite_type = FavoriteType.Planet
    elif (body["type"] == "people"):
        favorite_type = FavoriteType.People
    else:
        return jsonify({"error": "Favorite type is not valid"}), 400
    try:
        # Validación de usuario
        user = User.query.get(user_id)
        if (user is None):
            return jsonify({"error": "User id not found"}), 404

        new_favorite = Favorites(
            element_id=body["favorite_id"], user_id=user_id, type=favorite_type)

        db.session.add(new_favorite)
        db.session.commit()
        return jsonify({"message": "Favorite created", "data": new_favorite.serialize()}), 201

    except Exception as ex:
        print(ex)
        return jsonify({"error": "Error on favorite create"}), 400
