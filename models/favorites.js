module.exports = function(sequelize, DataTypes){
    var Favorites = sequelize.define("Favorites", {
        poem_title: {
            type: DataTypes.STRING,
            allowNull: false,
            validations: {
                notEmpty: true,
                len: [1, 254]
            }
        },
        poem_author: {
            type: DataTypes.STRING,
            allowNull: false,
            validations: {
                notEmpty: true,
                len: [1, 160]
            }
        }
    });
    // Needs Associations:
    // Many Favorites belongs to One User
    Favorites.associate = function(models) {
        Favorites.belongsTo(models.Users, {
            foreignKey:{
                allowNull: false
            }
        })
    };
    return Favorites;
}