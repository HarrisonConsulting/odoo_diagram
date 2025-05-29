/** @odoo-module **/
import { Plugin } from "@html_editor/plugin";
import { _t } from "@web/core/l10n/translation";
import { renderToElement } from "@web/core/utils/render";
import { KNOWLEDGE_PLUGINS } from "@knowledge/editor/plugin_sets";

/**
 *
 * This component defines the `ArticleDiagramPlugin`, a custom plugin for the Odoo Knowledge HTML editor.
 *
 * It adds a user command for inserting a diagram placeholder block into a knowledge article.
 * The diagram is rendered from an OWL template and tracked in the editor's DOM and history.
 *
 * The plugin is registered into the `KNOWLEDGE_PLUGINS` array, making it available in the
 * context of the Knowledge app editor.
 *
 * Key Features:
 * - Adds a command to the '/' menu and powerbox to insert a diagram block
 * - Injects a predefined template into the editable article content
 * - Tracks the DOM change for undo/redo history
 *
 * Dependencies:
 * - "history": for undo/redo support
 * - "dom": for direct DOM insertion of content
 */

export class ArticleDiagramPlugin extends Plugin {
    static id = "articleDiagram";
    static dependencies = ["history", "dom"];
    resources = {
        user_commands: [
            {
                id: "insertArticleDiagram",
                title: _t("Diagram"),
                description: _t("Insert Diagrams"),
                icon: "fa-list",
                run: this.insertArticleDigram.bind(this),
            },
        ],
        powerbox_items: [
            {
                categoryId: "knowledge",
                commandId: "insertArticleDiagram",
            }
        ],
    };
    /**
    * Inserts the diagram blueprint into the editor DOM and adds a history step.
    */
    insertArticleDigram() {
        const articleDiagramBlueprint = renderToElement("diagram_knowledge_article.ArticleDiagramBlueprint");
        this.dependencies.dom.insert(articleDiagramBlueprint);
        this.dependencies.history.addStep();
    }
}
// Register the plugin in the Knowledge editor
KNOWLEDGE_PLUGINS.push(ArticleDiagramPlugin);
