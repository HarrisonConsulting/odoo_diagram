/** @odoo-module */

import { HtmlField } from "@web_editor/js/backend/html_field";
import { patch } from "@web/core/utils/patch";
// Behaviors:
import { DiagramBehavior } from "@diagram_knowledge_article/js/diagram_behavior";
/**
 * Patches the `HtmlField` to add support for `DiagramBehavior` in knowledge articles.
 *
 * This patch extends the `HtmlField` component by adding a new behavior type (`o_knowledge_behavior_type_diagram`)
 * which is associated with the `DiagramBehavior`. This allows the `HtmlField` to handle diagram-related functionality
 * within the Odoo Knowledge module.
 *
 * The patch modifies the `setup` method to register the behavior for the diagram functionality.
 */
const HtmlFieldPatchDiagram = {
    setup() {
        super.setup(...arguments);
        this.behaviorTypes.o_knowledge_behavior_type_diagram = {
                Behavior: DiagramBehavior,
            }
        },
}
patch(HtmlField.prototype, HtmlFieldPatchDiagram);
