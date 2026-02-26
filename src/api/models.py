from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey, Enum, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
import enum
from datetime import datetime


db = SQLAlchemy()


class FavoriteType(enum.Enum):
    Planet = 1
    People = 2


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    full_name: Mapped[str] = mapped_column(String(120), nullable=True)
    address: Mapped[str] = mapped_column(String(120), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    favorites: Mapped[List["Favorites"]] = relationship(back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "fullName": self.full_name,
        }

    def serialize_with_favorites(self):
        mapped_favorites = list(map(lambda f: f.serialize(), self.favorites))
        return {
            "id": self.id,
            "username": self.username,
            "fullName": self.full_name,
            "favorites": mapped_favorites
        }


class Favorites(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    element_id: Mapped[int] = mapped_column(Integer())
    type: Mapped[FavoriteType] = mapped_column(
        Enum(FavoriteType), nullable=True)
    user_id: Mapped[int] = mapped_column(Integer(), ForeignKey("user.id"))
    user: Mapped[User] = relationship(back_populates="favorites")

    def serialize(self):
        return {
            "id": self.id,
            "element_type": self.type.name,
            "element_id": self.element_id
        }


class BlockedToken(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    jti: Mapped[str] = mapped_column(String(50), nullable=False)
    blocked_at: Mapped[datetime] = mapped_column(
        DateTime(), default=datetime.now(), nullable=True)
