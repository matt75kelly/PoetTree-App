module.exports = function(sequelize, DataTypes){
    var Poems = sequelize.define("Poems", {
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
            allowNull: true,
            validations: {
                notEmpty: true,
                len: [1, 254]
            }
        },
        poem_body: {
            type: DataTypes.TEXT,
            allowNull: false,
            validations: {
                notEmpty: true
            }
        }
    });
    // Needs associations:
    // One poem to many ratings
    // One poem to many comments
    Poems.associate = function(models){
        Poems.hasMany(models.Ratings, {
            as: "Ratings",
            onDelete: "cascade"
        });
        Poems.hasMany(models.Comments, {
            as: "comments",
            onDelete: "cascade"
        });
    }
    return Poems;
}