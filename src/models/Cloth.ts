import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';


interface ClothAttributes {
  CloId: number;
  CloName: string;
  CloType: number;
  CloCreatedAt: Date;
  CloUpdatedAt: Date;
}


interface ClothCreationAttributes extends Optional<ClothAttributes, 'CloId'> {}


class Cloth extends Model<ClothAttributes, ClothCreationAttributes> {
  public CloId!: number;
  public CloName!: string;
  public CloType!: number;
  public CloCreatedAt!: Date;
  public CloUpdatedAt!: Date;
}

Cloth.init(
  {
    CloId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    CloName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    CloType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    CloCreatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    CloUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'cloth',
    timestamps: false, 
  }
);

export default Cloth;
