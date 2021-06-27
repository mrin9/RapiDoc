import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';
import '~/components/api-request';
import '~/components/api-response';
import codeSamplesTemplate from '~/templates/code-samples-template';
import callbackTemplate from '~/templates/callback-template';
import { pathSecurityTemplate } from '~/templates/security-scheme-template';
import { pathIsInSearch, rapidocApiKey } from '~/utils/common-utils';

function toggleExpand(path) {
  if (path.expanded) {
    path.expanded = false; // collapse
    if (this.updateRoutes === 'true') {
      window.history.replaceState(null, null, `${window.location.href.split('#')[0]}`);
    }
  } else {
    path.expanded = true; // Expand
    const newHash = `#${path.elementId}`;
    if (this.updateRoutes === 'true') {
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, null, `${window.location.href.split('#')[0]}${newHash}`);
      }
    }
  }
  this.requestUpdate();
}

export function expandCollapseAll(operationsRootEl, action = 'expand-all') {
  const elList = [...operationsRootEl.querySelectorAll('.section-tag')];
  if (action === 'expand-all') {
    elList.map((el) => {
      el.classList.replace('collapsed', 'expanded');
    });
  } else {
    elList.map((el) => {
      el.classList.replace('expanded', 'collapsed');
    });
  }
}

function onExpandCollapseAll(e, action = 'expand-all') {
  expandCollapseAll.call(this, e.target.closest('.operations-root'), action);
}

/* eslint-disable indent */
function endpointHeadTemplate(path, pathsExpanded = false) {
  return html`
  <summary @click="${(e) => { toggleExpand.call(this, path, e); }}" class='endpoint-head ${path.method} ${path.deprecated ? 'deprecated' : ''} ${pathsExpanded || path.expanded ? 'expanded' : 'collapsed'}'>
    <div class="method ${path.method} ${path.deprecated ? 'deprecated' : ''}"> ${path.method} </div> 
    <div class="path ${path.deprecated ? 'deprecated' : ''}"> 
      ${path.path} 
      ${path.isWebhook ? html`<span style="font-family: var(--font-regular); font-size: var(--); font-size: var(--font-size-small); color:var(--primary-color); margin-left: 16px"> Webhook</span>` : ''}
    </div>
    ${path.deprecated
      ? html`
        <span style="font-size:var(--font-size-small); text-transform:uppercase; font-weight:bold; color:var(--red); margin:2px 0 0 5px;"> 
          deprecated 
        </span>`
      : ''
    }
    ${this.showSummaryWhenCollapsed
      ? html`
        <div class="only-large-screen" style="min-width:60px; flex:1"></div>
        <div class="descr">${path.summary || path.shortSummary} </div>`
      : ''
    }
  </summary>
  `;
}

function endpointBodyTemplate(path) {
  const acceptContentTypes = new Set();
  for (const respStatus in path.responses) {
    for (const acceptContentType in (path.responses[respStatus]?.content)) {
      acceptContentTypes.add(acceptContentType.trim());
    }
  }
  const accept = [...acceptContentTypes].join(', ');
  // Filter API Keys that are non-empty and are applicable to the the path
  const nonEmptyApiKeys = this.resolvedSpec.securitySchemes.filter((v) => (v.finalKeyValue && path.security?.some((ps) => (v.apiKeyId in ps)))) || [];

  // If a RapiDoc API Key is specified on the element and its value is not hyphen(-) then include it for all paths
  const rapiDocApiKey = this.resolvedSpec.securitySchemes.find((v) => (v.apiKeyId === rapidocApiKey && v.value !== '-'));
  if (rapiDocApiKey) {
    nonEmptyApiKeys.push(rapiDocApiKey);
  }

  const codeSampleTabPanel = path.xCodeSamples ? codeSamplesTemplate(path.xCodeSamples) : '';
  return html`
  <div class='endpoint-body ${path.method} ${path.deprecated ? 'deprecated' : ''}'>
    <div class="summary">
      ${path.summary
        ? html`<div class="title">${path.summary}<div>`
        : path.shortSummary !== path.description
          ? html`<div class="title">${path.shortSummary}</div>`
          : ''
      }
      ${path.xBadges && path.xBadges?.length > 0
        ? html`
          <div style="display:flex; flex-wrap:wrap;font-size: var(--font-size-small);">
            ${path.xBadges.map((v) => (
                html`<span style="margin:1px; margin-right:5px; padding:1px 8px; font-weight:bold; border-radius:12px;  background-color: var(--light-${v.color}, var(--input-bg)); color:var(--${v.color}); border:1px solid var(--${v.color})">${v.label}</span>`
              ))
            }
          </div>
          `
        : ''
      }

      ${path.description ? html`<div class="m-markdown"> ${unsafeHTML(marked(path.description))}</div>` : ''}
      <slot name="${path.elementId}"></slot>
      ${pathSecurityTemplate.call(this, path.security)}
      ${codeSampleTabPanel}
    </div>  
    <div class='req-resp-container'> 
      <div style="display:flex; flex-direction:column" class="view-mode-request ${this.layout}-layout">
        <api-request
          class = "${this.renderStyle}-mode ${this.layout}-layout"
          style = "width:100%;"
          method = "${path.method}", 
          path = "${path.path}" 
          .parameters = "${path.parameters}"
          .request_body = "${path.requestBody}"
          .api_keys = "${nonEmptyApiKeys}"
          .servers = "${path.servers}" 
          server-url = "${path.servers && path.servers.length > 0 ? path.servers[0].url : this.selectedServer.computedUrl}" 
          active-schema-tab = "${this.defaultSchemaTab}"
          fill-request-fields-with-example = "${this.fillRequestFieldsWithExample}"
          allow-try = "${this.allowTry}"
          accept = "${accept}"
          render-style="${this.renderStyle}" 
          schema-style = "${this.schemaStyle}" 
          schema-expand-level = "${this.schemaExpandLevel}"
          schema-description-expanded = "${this.schemaDescriptionExpanded}"
          allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
          schema-hide-read-only = "${this.schemaHideReadOnly}"
          show-examples = "${this.showExamples}"
          fetch-credentials = "${this.fetchCredentials}"
          exportparts="btn btn-fill btn-outline btn-try"
        > </api-request>

          ${path.callbacks ? callbackTemplate.call(this, path.callbacks) : ''}
      </div>  

      <api-response
        class = "${this.renderStyle}-mode"
        style = "width:100%;"
        .responses="${path.responses}"
        active-schema-tab = "${this.defaultSchemaTab}" 
        render-style="${this.renderStyle}" 
        schema-style="${this.schemaStyle}"
        schema-expand-level = "${this.schemaExpandLevel}"
        schema-description-expanded = "${this.schemaDescriptionExpanded}"
        allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
        schema-hide-write-only = "${this.schemaHideWriteOnly}"
        show-examples = "${this.showExamples}"
        selected-status = "${Object.keys(path.responses || {})[0] || ''}"
        exportparts = "btn--resp btn-fill--resp btn-outline--resp"
      > </api-response>
    </div>
  </div>`;
}

export default function endpointTemplate(showExpandCollapse = true, showTags = true, pathsExpanded = false) {
  if (!this.resolvedSpec) { return ''; }
  return html`
    ${showExpandCollapse
      ? html`
        <div style="display:flex; justify-content:flex-end;"> 
          <span @click="${(e) => onExpandCollapseAll(e, 'expand-all')}" style="color:var(--primary-color); cursor:pointer;">
            Expand all
          </span> 
          &nbsp;|&nbsp; 
          <span @click="${(e) => onExpandCollapseAll(e, 'collapse-all')}" style="color:var(--primary-color); cursor:pointer;" >
            Collapse all
          </span> 
          &nbsp; sections
        </div>`
      : ''
    }
    ${this.resolvedSpec.tags.map((tag) => html`
      ${showTags
        ? html` 
          <div class='regular-font section-gap section-tag ${tag.expanded ? 'expanded' : 'collapsed'}'> 
            <div class='section-tag-header' @click="${() => { tag.expanded = !tag.expanded; this.requestUpdate(); }}">
              <div id='${tag.elementId}' class="sub-title tag" style="color:var(--primary-color)">${tag.name}</div>
            </div>
            <div class='section-tag-body'>
              <slot name="${tag.elementId}"></slot>
              <div class="regular-font regular-font-size m-markdown" style="padding-bottom:12px">
                ${unsafeHTML(marked(tag.description || ''))}
              </div>
              ${tag.paths.filter((v) => {
                if (this.matchPaths) {
                  return pathIsInSearch(this.matchPaths, v);
                }
                return true;
                }).map((path) => html`
                <section id='${path.elementId}' class='m-endpoint regular-font ${path.method} ${pathsExpanded || path.expanded ? 'expanded' : 'collapsed'}'>
                  ${endpointHeadTemplate.call(this, path, pathsExpanded)}      
                  ${pathsExpanded || path.expanded ? endpointBodyTemplate.call(this, path) : ''}
                </section>`)
              }
            </div>
          </div>`
        : html`
          <div class='section-tag-body'>
          ${tag.paths.filter((v) => {
            if (this.matchPaths) {
              return pathIsInSearch(this.matchPaths, v);
            }
            return true;
            }).map((path) => html`
            <section id='${path.elementId}' class='m-endpoint regular-font ${path.method} ${pathsExpanded || path.expanded ? 'expanded' : 'collapsed'}'>
              ${endpointHeadTemplate.call(this, path, pathsExpanded)}      
              ${pathsExpanded || path.expanded ? endpointBodyTemplate.call(this, path) : ''}
            </section>`)
          }
          </div>
        `
      }
  `)
  }`;
}
/* eslint-enable indent */
