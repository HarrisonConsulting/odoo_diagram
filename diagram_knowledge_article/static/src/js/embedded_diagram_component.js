/** @odoo-module */
import { Component } from "@odoo/owl";
const { onMounted, useRef, useExternalListener } = owl;
import { useService } from "@web/core/utils/hooks";
import { rpc as jsonrpc } from "@web/core/network/rpc";
import { MAIN_EMBEDDINGS } from "@html_editor/others/embedded_components/embedding_sets";
import { READONLY_MAIN_EMBEDDINGS } from "@html_editor/others/embedded_components/embedding_sets";
import { user } from "@web/core/user";

/**
 * EmbeddedDiagramComponent is responsible for managing the interaction with an embedded diagram editor
 * within a knowledge article.
 *
 * It handles the initialization, configuration, editing, saving, and communication with the
 * diagram editor iframe. The behavior also listens for window events and manages diagram data
 * via communication with the iframe.
 */
export class EmbeddedDiagramComponent extends Component {
    static template = "diagram_knowledge_article.EmbeddedDiagram";
    setup() {
        super.setup();
        this.orm = useService("orm");
        this.frameRef = useRef('diagramEditor');
        this.handleMessageEvent = this._handleMessageEvent.bind(this);
        onMounted(async () => {
            this.frame = this.frameRef.el;
            this.startEditing();
            await this.loadIframe();
        });
        useExternalListener(window, "click", this.onWindowClick, true);
    }
    onWindowClick(ev){
        if (ev.target.parentElement?.classList.contains('load-diagram-version')) {
            this.initializeEditor('this.props', this.env.model);
        }
    }
    get url() {
        var url = "https://embed.diagrams.net/?proto=json&spin=1&ui=min&libraries=1&fit=1&saveAndExit=0&noExitBtn=1"
        return url;
    }
    postMessage (msg) {
        if (this.frame != null) {
            this.frame?.contentWindow?.postMessage(JSON.stringify(msg), '*');
        }
    }
    async initializeEditor () {
        let [record] = await this.orm.read("knowledge.article",  [this.env.model.config.resId], ['diagram'])
        const defaultDiagramXml = `<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel>`;
        this.postMessage({
            action: 'load',
            xml: record.diagram || defaultDiagramXml,
            autosave: '1',
        });
    }
    async loadIframe(){
        if(user){
            if (this.env.model.root.data.user_permission !== "write") {
                this.frame.src = '';
                await new Promise(resolve => setTimeout(resolve, 2000));
                var text = encodeURIComponent(this.env.model.root.data?.diagram);
                this.frame.src = `https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&pageScale=1&layers=1&nav=1&title=#R${text}`;
            }
            else {
                this.frame.src = '';
                await new Promise(resolve => setTimeout(resolve, 2000));
                this.frame.src = `https://embed.diagrams.net/?proto=json&spin=1&ui=min&libraries=1&saveAndExit=0&noSaveBtn=1&noExitBtn=1`;
            }
        }
        else{
            this.frame.src = '';
            await new Promise(resolve => setTimeout(resolve, 2000));
            var text = encodeURIComponent(this.env.model.root.data?.diagram);
            this.frame.src = `https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&pageScale=1&layers=1&nav=1&title=#R${text}`;
        }
    }
    configureEditor () {
        this.postMessage({
            action: 'configure',
            config: this.env.model.config
        });
    }
    startEditing() {
        window.addEventListener('message', this.handleMessageEvent);
    }
    _handleMessageEvent(evt) {
        if (this.frame != null && evt.source == this.frame.contentWindow &&
            evt.data.length > 0) {
            try {
                var msg = JSON.parse(evt.data);
                if (msg != null) {
                    this.handleMessage(msg);
                }
            } catch (e) {
                console.error(e);
            }
        }
    }
    async handleMessage(msg) {
        switch (msg.event) {
            case 'configure':
                this.configureEditor();
                break;
            case 'init':
                this.initializeEditor();
                break;
            case 'save':
                this.saveDiagram(msg.xml, msg.exit);
                break;
            case 'autosave':
                 await this.saveDiagram(msg.xml, msg.exit);
                 break;
            default:
                console.log(msg.event);
                break;
        }
    }
    async saveDiagram(xml, exit) {
        var self = this
        await this.orm.write("knowledge.article", [this.env.model.config.resId], {
                    diagram: xml,
                    save_diagram: true,
                });
    }
}
/**
 * Embedding registration object used to hook this component into Odoo's HTML editor framework.
 */
export const diagramEmbedding = {
    name: "DiagramContent",
    Component: EmbeddedDiagramComponent,
};
// Register component in editor embedding sets
MAIN_EMBEDDINGS.push(diagramEmbedding);
READONLY_MAIN_EMBEDDINGS.push(diagramEmbedding);
