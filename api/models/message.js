/**
 * MESSAGE MODEL
 */

module.exports = (sequelize, DataTypes) => {
	const Message = sequelize.define("Message", {
		content: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
	Message.associate = function (models) {
		Message.belongsTo(models.User, {
			foreignKey: "userId",
			onDelete: "CASCADE",
		});
	};

	return Message;
};
