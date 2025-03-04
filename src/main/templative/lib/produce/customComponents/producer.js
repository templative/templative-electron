// produceComponent.js

const outputWriter = require('../outputWriter');
const svgscissors = require('./svgscissors/svgScissors');
const os = require('os');

const { ProduceProperties } = require('../../manage/models/produceProperties');
const { StudioData, GameData, ComponentData, ComponentBackData, PieceData } = require('../../manage/models/gamedata');
const ComponentComposition = require('../../manage/models/composition');
const ComponentArtdata = require('../../manage/models/artdata');
const defineLoader = require('../../manage/defineLoader');

const { COMPONENT_INFO } = require('../../../../../shared/componentInfo');

class Producer {
    static async createComponent(produceProperties, componentComposition, componentData, componentArtdata) {
        throw new Error("Not implemented");
    }
}

module.exports = { Producer };
