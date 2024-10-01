// node index.js

const Sequelize = require("sequelize");

const sequelize = new Sequelize("ropa", "root", "resalesonline", {
  host: "127.0.0.1",
  port: 39061,
  dialect: "mysql",
});

/*
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection succesful!");
  })
  .catch((err) => {
    console.log("Error connecting to database!");
  });
*/

const Cloth = sequelize.define(
  "cloth",
  {
    CloId: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    CloName: {
      type: Sequelize.DataTypes.STRING,
      defaultValue: "",
      allowNull: false,
    },
    CloType: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    CloCreatedAt: {
      type: Sequelize.DATE,
      defaultValue: sequelize.fn('NOW'),
      allowNull: false,
    },
    CloUpdatedAt: {
      type: Sequelize.DATE,
      defaultValue: sequelize.fn('NOW'),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "CloCreatedAt",
    updatedAt: "CloUpdatedAt",
  }
);

const Combination = sequelize.define(
  "combination",
  {
    ComId: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ComName: {
      type: Sequelize.DataTypes.STRING,
      defaultValue: "",
      allowNull: false,
    },
    ComSeason: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    ComCreatedAt: {
      type: Sequelize.DATE,
      defaultValue: sequelize.fn('NOW'),
      allowNull: false,
    },
    ComUpdatedAt: {
      type: Sequelize.DATE,
      defaultValue: sequelize.fn('NOW'),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "ComCreatedAt",
    updatedAt: "ComUpdatedAt",
  }
);

sequelize
  .sync({ alter: true })
  .then((data) => {
    console.log("Tables synced correctly!");
  })
  .catch((err) => {
    console.log("Error syncing the table and model!");
  });
