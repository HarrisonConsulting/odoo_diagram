/** @odoo-module */

import { AbstractBehavior } from "@knowledge/components/behaviors/abstract_behavior/abstract_behavior";

const { onMounted, useRef, useExternalListener } = owl;
import { jsonrpc } from "@web/core/network/rpc_service";

/**
 * DiagramBehavior is responsible for managing the interaction with an embedded diagram editor
 * within a knowledge article.
 *
 * It handles the initialization, configuration, editing, saving, and communication with the
 * diagram editor iframe. The behavior also listens for window events and manages diagram data
 * via communication with the iframe.
 */

export class DiagramBehavior extends AbstractBehavior {
    static template = "knowledge.DiagramBehavior";
    setup() {
        super.setup();
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
        if($(ev.target).parent().hasClass('load-diagram-version')){
            this.initializeEditor()
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
        this.postMessage({
            action: 'load',
            xml: this.props.record.data.diagram,
            autosave: '1',
        });
    }
    async loadIframe(){
        if (this.props.readonly === true) {
                this.frame.src = '';
                await new Promise(resolve => setTimeout(resolve, 2000));
                var text = encodeURIComponent(this.props.record.data.diagram);
                this.frame.src = `https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&pageScale=1&layers=1&nav=1&title=#R${text}`; // Reset the src to the original URL (reloads the iframe)
        }
        else{
            this.frame.src = '';
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.frame.src = `https://embed.diagrams.net/?proto=json&spin=1&ui=min&libraries=1&saveAndExit=0&noExitBtn=1`;
        }
    }

    configureEditor () {
        this.postMessage({
            action: 'configure',
            config: this.props.config
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
        var self=this
        await jsonrpc(`/web/dataset/call_kw/${this.props.record._config.resModel}/write`, {
            model: this.props.record._config.resModel,
            method: "write",
            args: [
                [this.props.record._config.resId],
                {'diagram': xml, 'save_diagram':true}
            ],
            kwargs:{}
        });
        self.props.record.data.diagram = xml;
    }
}
