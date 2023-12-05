var mongoose= require('mongoose');
var Schema= mongoose.Schema;

var bicicletaSchema= new Schema({
    code: Number,
    color: String,
    modelo: String,
    ubicacion:{
        type: [Number], index: {type: '2dsphere', sparse: true}
    }
});

bicicletaSchema.statics.createInstance= function(code, color, modelo, ubicacion){
    return new this({
        code: code,
        color: color,
        modelo: modelo,
        ubicacion: ubicacion
    });
}

bicicletaSchema.methods.toString= function(){
    return 'code: '+ this.code + " | color: "+ this.color;
}

bicicletaSchema.statics.allBicis= function(){
    return this.find({});
}

bicicletaSchema.statics.add= function(aBici){
    return this.create(aBici);
}

bicicletaSchema.statics.findByCode= function(aCode){
    return this.findOne({code: aCode});
}

bicicletaSchema.statics.removeByCode= function(aCode){
    return this.deleteOne({code: aCode});
}

bicicletaSchema.statics.updateByCode= function(aCode, aBici){
    return this.updateOne({code: aCode}, aBici);
}
module.exports= mongoose.model('Bicicleta', bicicletaSchema);