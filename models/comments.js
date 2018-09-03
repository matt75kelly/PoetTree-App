module.exports = function(sequelize, DataTypes){
    var Comments = sequelize.define("Comments", {
        comment_title: {
            type: DataTypes.STRING,
            allowNull: false,
            validations: {
                notEmpty: true,
                len: [1, 60]
            }
        },
        comment_author: {
            type: DataTypes.STRING,
            allowNull: false,
            validations: {
                notEmpty: true,
                len: [1, 40]
            }
        },
        comment_body: {
            type: DataTypes.STRING,
            allowNull: false,
            validations: {
                notEmpty: true,
                len: [1, 254],
            }
        },
        is_private: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false
        }    
    });
    // Needs associations:
    // Many comments belongs to one user
    // Many comments belong to one poem
    Comments.associate= function(models){
        Comments.belongsTo(models.Poems, {
            foreignKey: {
                allowNull: false
            }
        });
        Comments.belongsTo(models.Users, {
            foreignKey: {
                allowNull: false
            }
        });
    }
    return Comments;
}