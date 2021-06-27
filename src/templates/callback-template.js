import { html } from 'lit-element';

/* eslint-disable indent */
export default function callbackTemplate(callbacks) {
  return html`
    <div class="req-res-title" style="margin-top:12px">CALLBACKS</div>
    ${Object.entries(callbacks).map((kv) => html`
      <div class="tiny-title" style="padding: 12px; border:1px solid var(--light-border-color)"> 
        ${kv[0]}
        ${Object.entries(kv[1]).map((pathObj) => html`
          <div class="mono-font small-font-size" style="display:flex; margin-left:16px;">
            <div> 
              ${Object.entries(pathObj[1]).map((method) => html`
                <div>
                  <div style="margin-top:12px;">
                    <div class="method method-fg ${method[0]}" style="width:70px; border:none; margin:0; padding:0; line-height:20px; vertical-align: baseline;text-align:left"> 
                      <span style="font-size:20px;"> &#x2944; </span> 
                      ${method[0]} 
                    </div>
                    <span style="line-height:20px; vertical-align: baseline;">${pathObj[0]} </span>
                  </div>  
                  <div class='expanded-req-resp-container'>
                    <api-request
                      class = "${this.renderStyle}-mode callback"  
                      style = "width:100%;"
                      callback = "true"
                      method = "${method[0] || ''}", 
                      path = "${pathObj[0] || ''}" 
                      .parameters = "${method[1]?.parameters || ''}" 
                      .request_body = "${method[1]?.requestBody || ''}"
                      fill-request-fields-with-example = "${this.fillRequestFieldsWithExample}"
                      allow-try = "false"
                      render-style="${this.renderStyle}" 
                      schema-style = "${this.schemaStyle}"
                      active-schema-tab = "${this.defaultSchemaTab}"
                      schema-expand-level = "${this.schemaExpandLevel}"
                      schema-description-expanded = "${this.schemaDescriptionExpanded}"
                      allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}",
                      schema-hide-read-only = "${this.schemaHideReadOnly}"
                      show-examples = "${this.showExamples}"
                      fetch-credentials = "${this.fetchCredentials}"
                      exportparts="btn btn-fill btn-outline btn-try"
                    > </api-request>

                    <api-response
                      style = "width:100%;"
                      class = "${this.renderStyle}-mode"
                      callback = "true"
                      .responses="${method[1]?.responses}"
                      render-style="${this.renderStyle}"
                      schema-style="${this.schemaStyle}"
                      active-schema-tab = "${this.defaultSchemaTab}"
                      schema-expand-level = "${this.schemaExpandLevel}"
                      schema-description-expanded = "${this.schemaDescriptionExpanded}"
                      show-examples = "${this.showExamples}"
                      allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
                      exportparts = "btn--resp btn-fill--resp btn-outline--resp"
                    > </api-response>
                  </div>
                </div>  
              `)}
            </div>  
          </div>  
        `)}
      </div>  
    `)}
  `;
}
/* eslint-enable indent */
