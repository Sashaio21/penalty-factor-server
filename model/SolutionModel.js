import { model, Schema } from "mongoose";

const solutionSchema = new Schema({
    x1: Number,
    x2: Number,
    fun: Number
  });
   
  const pointSchema = new Schema({
    x1: Number,
    x2: Number
  });
  
  const solutionDataSchema = new Schema({
    solution: solutionSchema,
    points: [pointSchema],
    execution_time: Number
  });
  
  const mainSchema = new Schema({
    userId: Schema.Types.ObjectId,
    nameSolution: String,
    expression: String,
    constraint_expr1: String,
    constraint_type1: String,
    constraint_value1: Number,
    constraint_expr2: String,
    constraint_type2: String,
    constraint_value2: Number,
    function_type: String,
    epsilon: Number,
    x1_initial: Number,
    x2_initial: Number,
    method: String,
    solution_data: solutionDataSchema,
    createdAt: Date,
    updatedAt: Date,
  },
  {
    timestamps: true
  });


export default model('Solution', mainSchema)
// export default Solution