import { html } from 'lit-element';
import logoTemplate from '@/templates/logo-template';

/* eslint-disable indent */
export default function headerTemplate() {
  return html`
  <header class="row header regular-font" style="padding:8px 4px 8px 4px;min-height:48px;">
    <div class="only-large-screen-flex" style="align-items: center;">
      <slot name="logo" class="logo">
        ${logoTemplate('height:36px;width:36px;margin-left:5px')}
        <!-- m-logo style="height:36px;width:36px;margin-left:5px"></m-logo -->
      </slot>  
      <div class="header-title">${this.headingText}</div>
    </div>  
    <div style="margin: 0px 8px;display:flex;flex:1">
      ${(this.allowSpecUrlLoad === 'false')
        ? ''
        : html`
          <input id="spec-url" 
            type="text" 
            style="font-size:var(--font-size-small)" 
            class="header-input mono-font" 
            placeholder="Spec URL" 
            value="${this.specUrl || ''}" 
            @change="${this.onSepcUrlChange}" 
            spellcheck="false" 
          >
          <div style="margin: 6px 5px 0 -24px; font-size:var(--title-font-size); cursor:pointer;">&#x2b90;</div> 
        `
      } 
      ${(this.allowSpecFileLoad === 'false')
        ? ''
        : html`
          <input id="spec-file" 
            type="file" 
            style="display:none" 
            value="${this.specFile || ''}" 
            @change="${this.onSepcFileChange}" 
            spellcheck="false"
           >
          <button class="m-btn primary only-large-screen" style="margin-left:10px;"  @click="${this.onFileLoadClick}"> LOCAL JSON FILE </button>
        `
      }
      <slot name="header"></slot>
      ${(this.allowSearch === 'false' || 'read focused'.includes(this.renderStyle))
        ? ''
        : html`  
          <input id="search" class="header-input" type="text"  placeholder="search" @change="${this.onSearchChange}" style="max-width:130px;margin-left:10px;" spellcheck="false" >
          <div style="margin: 6px 5px 0 -24px; font-size:var(--title-font-size); cursor:pointer;">&#x2b90;</div>
        `
      }
      
      ${(this.allowSearch === 'false' || this.allowSearchByParams === 'false' || 'read focused'.includes(this.renderStyle))
        ? ''
        : html`
          <button class="m-btn" style="color: white; margin-left: 10px;" @click="${this.showSearchModal}">
            Search by parameters
          </button>
        `
      }
    </div>
    </header>`;
  }
/* eslint-enable indent */
