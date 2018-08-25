module.exports = function(sequelize, DataTypes){
    var Comments = sequelize.define("Comments", {
        comment_body: {
            type: DataTypes.STRING,
            allowNull: false,
            validations: {
                notEmpty: true,
                len: [1, 254]
            }
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