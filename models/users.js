module.exports = function(sequelize, DataTypes) {
    var Users = sequelize.define("Users",{
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validations: {
                len: [1, 254],
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validations: {
                len: [1, 254],
                notEmpty: true,
                isEmail: true
            }
        }
    })
    // Needs associations to other tables:
    // One User to many Favorites
    // One User to many Ratings
    // One User to many Comments
    Users.associate = function(models) {
        Users.hasMany(models.Favorites, {
            as: "favorites",
            onDelete: "cascade"
        });
        Users.hasMany(models.Ratings, {
            as: "ratings",
            onDelete: "cascade"
        });
        Users.hasMany(models.Comments, {
            as: "comments",
            onDelete: "cascade"
        });
    };    
    return Users;
    }
