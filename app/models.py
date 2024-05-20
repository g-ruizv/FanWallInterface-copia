from . import db

controllers_configurations = db.Table(
    'controllers_configurations',
    db.Column('controller_id', db.String(80), db.ForeignKey('controller.id'), primary_key=True),
    db.Column('configuration_id', db.Integer, db.ForeignKey('configuration.id'), primary_key=True),
    db.Column('x_coordinate', db.Integer, nullable=False),
    db.Column('y_coordinate', db.Integer, nullable=False)
)

class Controller(db.Model):
    id = db.Column(db.String(80), primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)

    def __repr__(self):
        return '<Controller %r>' % self.name

class Configuration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    controllers = db.relationship('Controller', lazy='subquery', secondary=controllers_configurations, backref=db.backref('configurations', lazy=True))

    def __repr__(self):
        return '<Configuration %r>' % self.name
