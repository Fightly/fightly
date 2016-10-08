(function (module) {
"use strict";

class Actions {
    constructor() {
        this._actions = {};
    }

    add(namespace, name, action) {
        if (!this._actions[namespace]) {
            this._actions[namespace] = {};
        }

        this._actions[namespace][name] = action;
    }

    execute(actionMeta) {
        let [namespace, name] = actionMeta.type.split('.');
        let action = this._actions[namespace][name];

        let context = {
            manager: actionMeta.context.room.manager,
            playerId: null,
        };

        if (action.predicate.call(context, ...actionMeta.params)) {
            action.action.call(context, ...actionMeta.params);
        }
    }
}

module.exports = Actions;

})(module);
