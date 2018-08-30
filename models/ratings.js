module.exports = function(sequelize, DataTypes){
    var Ratings = sequelize.define("Ratings", {
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validations: {
                notEmpty: true,
                len: [1, 254],
                min: 0,
                max: 5
            },
            default: 3,
        },
    });
    // Needs associations:
    // Many ratings belong to one poem
    // Many ratings belong to one users
    Ratings.associate= function(models){
        Ratings.belongsTo(models.Poems, {
            foreignKey: {
                allowNull: false
            }
        });
        Ratings.belongsTo(models.Users, {
            foreignKey: {
                allowNull: false
            }
        });
    }
    return Ratings;
}