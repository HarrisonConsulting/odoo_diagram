/** @odoo-module */
import { EmbeddedDiagram } from "./embedded_diagram";
import { useService } from "@web/core/utils/hooks";
import { rpc } from "@web/core/network/rpc";
import { MAIN_EMBEDDINGS, READONLY_MAIN_EMBEDDINGS } from "@html_editor/others/embedded_components/embedding_sets";

/**
 * Portal-aware extension of EmbeddedDiagram
 * 
 * This enhanced version automatically detects the user context and switches
 * between editor and viewer modes based on permissions. It works for any
 * model that contains diagrams, not just project.task.
 */
export class PortalAwareEmbeddedDiagram extends EmbeddedDiagram {
    setup() {
        super.setup();
        // Services might not be available in portal context
        try {
            this.user = useService("user");
            this.orm = useService("orm");
        } catch (e) {
            // In portal context, services are not available
            this.user = null;
            this.orm = null;
        }
    }
    
    /**
     * Check if the current user can edit the diagram
     * This considers:
     * - Internal users (base.group_user)
     * - Model-specific permissions
     * - Portal user collaborator status
     */
    async canEditDiagram() {
        // In portal context, services are not available
        if (!this.user || !this.orm) {
            // We're in portal/frontend context
            // Check if we're in a portal page
            if (window.location.pathname.includes('/my/')) {
                // Portal context - check via RPC
                const hostEl = this.props.host?.el;
                const recordEl = hostEl?.closest('[data-id]');
                const recordId = recordEl?.dataset.id;
                const model = recordEl?.dataset.model || this.getModelFromContext();
                
                if (model && recordId) {
                    try {
                        const canEdit = await rpc("/diagram/check_edit_permission", {
                            model: model,
                            res_id: parseInt(recordId),
                        });
                        return canEdit;
                    } catch (e) {
                        return false;
                    }
                }
            }
            // Default to readonly in portal
            return false;
        }
        
        // Backend context - check standard permissions
        const isInternalUser = await this.user.hasGroup("base.group_user");
        if (isInternalUser) {
            // Check if user has write access to the record
            try {
                const hostEl = this.props.host?.el;
                const recordEl = hostEl?.closest('[data-id]');
                const recordId = recordEl?.dataset.id;
                const model = recordEl?.dataset.model || this.getModelFromContext();
                
                if (model && recordId) {
                    // Try to check write permission
                    await this.orm.call(model, "check_access_rights", ["write", false]);
                    return true;
                }
            } catch (e) {
                // No write access
                return false;
            }
        }
        
        // For portal users, check model-specific permissions
        const hostEl = this.props.host?.el;
        const recordEl = hostEl?.closest('[data-id]');
        const recordId = recordEl?.dataset.id;
        const model = recordEl?.dataset.model || this.getModelFromContext();
        
        if (model && recordId && window.location.pathname.includes('/my/')) {
            // We're in portal context
            try {
                // Use a generic endpoint that checks model-specific permissions
                const canEdit = await rpc("/diagram/check_edit_permission", {
                    model: model,
                    res_id: parseInt(recordId),
                });
                return canEdit;
            } catch (e) {
                // Default to read-only for portal users
                return false;
            }
        }
        
        // Default based on readonly prop
        return !this.props.readonly;
    }
    
    /**
     * Extract model from various contexts
     */
    getModelFromContext() {
        // Try to get from environment (might not exist in portal)
        if (this.env?.model?.root?.resModel) {
            return this.env.model.root.resModel;
        }
        
        // Try to get from URL for portal views
        const urlParams = new URLSearchParams(window.location.search);
        const model = urlParams.get('model');
        if (model) {
            return model;
        }
        
        // Try to detect from common portal URLs
        const path = window.location.pathname;
        if (path.includes('/my/task')) {
            return 'project.task';
        } else if (path.includes('/my/ticket')) {
            return 'helpdesk.ticket';
        }
        
        return null;
    }
    
    /**
     * Override to use permission check
     */
    async initializeDiagram() {
        await super.initializeDiagram();
        
        // After initialization, check if we should switch to readonly
        const canEdit = await this.canEditDiagram();
        if (!canEdit && !this.props.readonly) {
            // Force readonly mode
            this.state.readonly = true;
        }
    }
    
    /**
     * Override URL generation to respect permissions
     */
    get diagramUrl() {
        const isReadonly = this.state.readonly || this.props.readonly;
        
        if (isReadonly) {
            // Viewer mode URL
            const encodedDiagram = encodeURIComponent(this.state.diagramData || '');
            return `https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&nav=1&title=#R${encodedDiagram}`;
        } else {
            // Editor mode URL
            return "https://embed.diagrams.net/?proto=json&spin=1&ui=min&libraries=1&saveAndExit=0&noSaveBtn=1&noExitBtn=1";
        }
    }
    
    /**
     * Override save to check permissions
     */
    async saveDiagram(xmlData) {
        const canEdit = await this.canEditDiagram();
        if (!canEdit) {
            console.warn("User does not have permission to save diagram");
            return;
        }
        
        return super.saveDiagram(xmlData);
    }
}

// Override the default registration with portal-aware version
// Remove existing registrations
const mainIndex = MAIN_EMBEDDINGS.findIndex(e => e.name === "drawio_diagram");
if (mainIndex >= 0) {
    MAIN_EMBEDDINGS.splice(mainIndex, 1);
}

const readonlyIndex = READONLY_MAIN_EMBEDDINGS.findIndex(e => e.name === "drawio_diagram");
if (readonlyIndex >= 0) {
    READONLY_MAIN_EMBEDDINGS.splice(readonlyIndex, 1);
}

// Register portal-aware version
MAIN_EMBEDDINGS.push({
    name: "drawio_diagram",
    Component: PortalAwareEmbeddedDiagram,
});

READONLY_MAIN_EMBEDDINGS.push({
    name: "drawio_diagram", 
    Component: PortalAwareEmbeddedDiagram,
});