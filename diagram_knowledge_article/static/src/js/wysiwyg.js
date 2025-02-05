/** @odoo-module **/

import { renderToElement } from "@web/core/utils/render";
import { Wysiwyg } from '@web_editor/js/wysiwyg/wysiwyg';
import {
    isSelectionInSelectors,
    preserveCursor,
} from "@web_editor/js/editor/odoo-editor/src/utils/utils";
import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";
// Patching Wysiwyg to add a "Knowledge Diagram" command in the powerbox
patch(Wysiwyg.prototype, {
    /**
     * @override
     * Adds a custom "Knowledge Diagram" option to the powerbox in the WYSIWYG editor.
     *
     * This method enhances the existing `_getPowerboxOptions` by adding a new category and command:
     * - The `Knowledge Diagram` category is added to the powerbox with a priority of 12.
     * - A new command `Diagram` is introduced to allow the user to insert a Draw.io diagram into the content.
     * - The command is described as "Add a Draw.io diagram" and uses the FontAwesome icon `fa-pencil-square`.
     * - The command is disabled if the current selection is within an element that matches the selector `.o_knowledge_behavior_anchor`.
     *
     * @returns {Array[Object]} - Returns the updated options object with added categories and commands.
     */
    _getPowerboxOptions() {
        const options = super._getPowerboxOptions();
        const {commands, categories} = options;
        if (this.options.knowledgeCommands) {
            categories.push(
                { name: _t('Knowledge Diagram'), priority: 12 },
            );
            commands.push({
            category: _t('Knowledge Diagram'),
                name: _t('Diagram'),
                priority: 1,
                description: _t('Add a Draw.io diagram'),
                fontawesome: 'fa-pencil-square',
                isDisabled: () => isSelectionInSelectors('.o_knowledge_behavior_anchor'),
                callback: () => {
                    this._insertDiagram();
                },
            })
        }
        return {...options, commands, categories};
    },
    _insertDiagram(){
        const restoreSelection = preserveCursor(this.odooEditor.document);
        const templateBlock = renderToElement('knowledge.DiagramBehaviorBlueprint', {
        behaviorType: "o_knowledge_behavior_type_diagram",
        });
        this._notifyNewBehavior(templateBlock, restoreSelection);
    }
});
