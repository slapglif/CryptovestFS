from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager, UserMixin
from app import db_session,Base, app
from sqlalchemy import Column, Integer, String, Boolean, BLOB
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.sql.expression import Executable, ClauseElement



from . import bcrypt
BCRYPT_LOG_ROUNDS = 12


class User(UserMixin, Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    social_id = Column(String(64), nullable=True, unique=True)
    nickname = Column(String(64), nullable=True, unique=True)
    email = Column(String(64), nullable=True, unique=True)
    email_confirmed = Column(Boolean(), nullable=True)
    _password = Column(String(128))
    oauth_token = Column(String(200))
    oauth_secret = Column(String(200))

    @hybrid_property
    def password(self):
        return self._password

    @password.setter
    def _set_password(self, plaintext):
        self._password = bcrypt.generate_password_hash(plaintext)

    def is_correct_password(self, plaintext):
        if bcrypt.check_password_hash(self._password, plaintext):
                return True

        return False

    @staticmethod
    def get_or_create(session, model, defaults=None, **kwargs):
        instance = session.query(model).filter_by(**kwargs).first()
        if instance:
            return instance
        else:
            params = dict((k, v) for k, v in kwargs.iteritems() if not isinstance(v, ClauseElement))
            if defaults:
                params.update(defaults)
            instance = model(**params)
            return instance
