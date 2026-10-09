function t(t,e,n,i){var o,s=arguments.length,r=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,n,i);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(s<3?o(r):s>3?o(e,n,r):o(e,n))||r);return s>3&&r&&Object.defineProperty(e,n,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,n=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let s=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(n&&void 0===t){const n=void 0!==e&&1===e.length;n&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&o.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const n=1===t.length?t[0]:e.reduce((e,n,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+t[i+1],t[0]);return new s(n,t,i)},a=n?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const n of t.cssRules)e+=n.cssText;return(t=>new s("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:u,getPrototypeOf:h}=Object,m=globalThis,f=m.trustedTypes,g=f?f.emptyScript:"",_=m.reactiveElementPolyfillSupport,b=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let n=t;switch(e){case Boolean:n=null!==t;break;case Number:n=null===t?null:Number(t);break;case Object:case Array:try{n=JSON.parse(t)}catch(t){n=null}}return n}},v=(t,e)=>!c(t,e),$={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const n=Symbol(),i=this.getPropertyDescriptor(t,n,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,n){const{get:i,set:o}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const s=i?.call(this);o?.call(this,e),this.requestUpdate(t,s,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const t=h(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const t=this.properties,e=[...p(t),...u(t)];for(const n of e)this.createProperty(n,t[n])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,n]of e)this.elementProperties.set(t,n)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const n=this._$Eu(t,e);void 0!==n&&this._$Eh.set(n,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const n=new Set(t.flat(1/0).reverse());for(const t of n)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const n=e.attribute;return!1===n?void 0:"string"==typeof n?n:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(n)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const n of i){const i=document.createElement("style"),o=e.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=n.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){const n=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,n);if(void 0!==i&&!0===n.reflect){const o=(void 0!==n.converter?.toAttribute?n.converter:y).toAttribute(e,n.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const n=this.constructor,i=n._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=n.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=i;const s=o.fromAttribute(e,t.type);this[i]=s??this._$Ej?.get(i)??s,this._$Em=null}}requestUpdate(t,e,n,i=!1,o){if(void 0!==t){const s=this.constructor;if(!1===i&&(o=this[t]),n??=s.getPropertyOptions(t),!((n.hasChanged??v)(o,e)||n.useDefault&&n.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,n))))return;this.C(t,e,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:i,wrapped:o},s){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),!0!==o||void 0!==s)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,n]of t){const{wrapped:t}=n,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,n,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[b("elementProperties")]=new Map,x[b("finalized")]=new Map,_?.({ReactiveElement:x}),(m.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,A=t=>t,k=w.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,z="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+E,M=`<${P}>`,C=document,j=()=>C.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,T="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,H=/>/g,I=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,L=/"/g,B=/^(?:script|style|textarea|title)$/i,W=t=>(e,...n)=>({_$litType$:t,strings:e,values:n}),F=W(1),q=W(2),V=Symbol.for("lit-noChange"),J=Symbol.for("lit-nothing"),Z=new WeakMap,G=C.createTreeWalker(C,129);function Y(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const K=(t,e)=>{const n=t.length-1,i=[];let o,s=2===e?"<svg>":3===e?"<math>":"",r=R;for(let e=0;e<n;e++){const n=t[e];let a,c,l=-1,d=0;for(;d<n.length&&(r.lastIndex=d,c=r.exec(n),null!==c);)d=r.lastIndex,r===R?"!--"===c[1]?r=N:void 0!==c[1]?r=H:void 0!==c[2]?(B.test(c[2])&&(o=RegExp("</"+c[2],"g")),r=I):void 0!==c[3]&&(r=I):r===I?">"===c[0]?(r=o??R,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?I:'"'===c[3]?L:D):r===L||r===D?r=I:r===N||r===H?r=R:(r=I,o=void 0);const p=r===I&&t[e+1].startsWith("/>")?" ":"";s+=r===R?n+M:l>=0?(i.push(a),n.slice(0,l)+z+n.slice(l)+E+p):n+E+(-2===l?e:p)}return[Y(t,s+(t[n]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class X{constructor({strings:t,_$litType$:e},n){let i;this.parts=[];let o=0,s=0;const r=t.length-1,a=this.parts,[c,l]=K(t,e);if(this.el=X.createElement(c,n),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=G.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(z)){const e=l[s++],n=i.getAttribute(t).split(E),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:n,ctor:"."===r[1]?it:"?"===r[1]?ot:"@"===r[1]?st:nt}),i.removeAttribute(t)}else t.startsWith(E)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(B.test(i.tagName)){const t=i.textContent.split(E),e=t.length-1;if(e>0){i.textContent=k?k.emptyScript:"";for(let n=0;n<e;n++)i.append(t[n],j()),G.nextNode(),a.push({type:2,index:++o});i.append(t[e],j())}}}else if(8===i.nodeType)if(i.data===P)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(E,t+1));)a.push({type:7,index:o}),t+=E.length-1}o++}}static createElement(t,e){const n=C.createElement("template");return n.innerHTML=t,n}}function Q(t,e,n=t,i){if(e===V)return e;let o=void 0!==i?n._$Co?.[i]:n._$Cl;const s=O(e)?void 0:e._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),void 0===s?o=void 0:(o=new s(t),o._$AT(t,n,i)),void 0!==i?(n._$Co??=[])[i]=o:n._$Cl=o),void 0!==o&&(e=Q(t,o._$AS(t,e.values),o,i)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:n}=this._$AD,i=(t?.creationScope??C).importNode(e,!0);G.currentNode=i;let o=G.nextNode(),s=0,r=0,a=n[0];for(;void 0!==a;){if(s===a.index){let e;2===a.type?e=new et(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new rt(o,this,t)),this._$AV.push(e),a=n[++r]}s!==a?.index&&(o=G.nextNode(),s++)}return G.currentNode=C,i}p(t){let e=0;for(const n of this._$AV)void 0!==n&&(void 0!==n.strings?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,i){this.type=2,this._$AH=J,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),O(t)?t===J||null==t||""===t?(this._$AH!==J&&this._$AR(),this._$AH=J):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==J&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(C.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:n}=t,i="number"==typeof n?this._$AC(t):(void 0===n.el&&(n.el=X.createElement(Y(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new tt(i,this),n=t.u(this.options);t.p(e),this.T(n),this._$AH=t}}_$AC(t){let e=Z.get(t.strings);return void 0===e&&Z.set(t.strings,e=new X(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let n,i=0;for(const o of t)i===e.length?e.push(n=new et(this.O(j()),this.O(j()),this,this.options)):n=e[i],n._$AI(o),i++;i<e.length&&(this._$AR(n&&n._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class nt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,i,o){this.type=1,this._$AH=J,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,n.length>2||""!==n[0]||""!==n[1]?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=J}_$AI(t,e=this,n,i){const o=this.strings;let s=!1;if(void 0===o)t=Q(this,t,e,0),s=!O(t)||t!==this._$AH&&t!==V,s&&(this._$AH=t);else{const i=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=Q(this,i[n+r],e,r),a===V&&(a=this._$AH[r]),s||=!O(a)||a!==this._$AH[r],a===J?t=J:t!==J&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}s&&!i&&this.j(t)}j(t){t===J?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends nt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===J?void 0:t}}class ot extends nt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==J)}}class st extends nt{constructor(t,e,n,i,o){super(t,e,n,i,o),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??J)===V)return;const n=this._$AH,i=t===J&&n!==J||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,o=t!==J&&(n===J||i);i&&this.element.removeEventListener(this.name,this,n),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const at=w.litHtmlPolyfillSupport;at?.(X,et),(w.litHtmlVersions??=[]).push("3.3.3");const ct=globalThis;class lt extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,n)=>{const i=n?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=n?.renderBefore??null;i._$litPart$=o=new et(e.insertBefore(j(),t),t,void 0,n??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}lt._$litElement$=!0,lt.finalized=!0,ct.litElementHydrateSupport?.({LitElement:lt});const dt=ct.litElementPolyfillSupport;dt?.({LitElement:lt}),(ct.litElementVersions??=[]).push("4.2.2");const pt=t=>(e,n)=>{void 0!==n?n.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ut={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:v},ht=(t=ut,e,n)=>{const{kind:i,metadata:o}=n;let s=globalThis.litPropertyMetadata.get(o);if(void 0===s&&globalThis.litPropertyMetadata.set(o,s=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),s.set(n.name,t),"accessor"===i){const{name:i}=n;return{set(n){const o=e.get.call(this);e.set.call(this,n),this.requestUpdate(i,o,t,!0,n)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=n;return function(n){const o=this[i];e.call(this,n),this.requestUpdate(i,o,t,!0,n)}}throw Error("Unsupported decorator location: "+i)};function mt(t){return(e,n)=>"object"==typeof n?ht(t,e,n):((t,e,n)=>{const i=e.hasOwnProperty(n);return e.constructor.createProperty(n,t),i?Object.getOwnPropertyDescriptor(e,n):void 0})(t,e,n)}function ft(t){return mt({...t,state:!0,attribute:!1})}var gt,_t;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(gt||(gt={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(_t||(_t={}));var bt=function(t,e,n,i){i=i||{},n=null==n?{}:n;var o=new Event(e,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});return o.detail=n,t.dispatchEvent(o),o};const yt="lay-z-spa-card",vt="lay-z-spa-card-editor",$t={climate:"climate.layzspa_temperature_control",bubbles:"switch.layzspa_airbubbles",heater:"binary_sensor.layzspa_heater",ready:"binary_sensor.layzspa_ready",time_to_ready:"sensor.layzspa_time_to_ready",ambient:"number.layzspa_amb_temp_c",error:"sensor.layzspa_error",connection:"binary_sensor.layzspa_connection",power_switch:"switch.jacuzzi",power:"sensor.jacuzzi_power",energy_today:"sensor.jacuzzi_energia_energy_daily",usage:"input_select.jacuzzi_uso",desired:"input_number.jacuzzi_temp_deseada",maintenance:"input_number.jacuzzi_temp_mantenimiento",plan:"sensor.jacuzzi_plan",planner:"input_boolean.jacuzzi_planificador",observe:"input_boolean.jacuzzi_planificador_observar",grid_extra:"sensor.jacuzzi_extra_red",ready_time:"input_datetime.jacuzzi_hora_listo",answer_script:"script.jacuzzi_respuesta_no_llega",ready_until:"input_datetime.jacuzzi_hora_fin",ready_time_workday:"input_datetime.jacuzzi_hora_listo_por_defecto",ready_time_holiday:"input_datetime.jacuzzi_hora_listo_festivos",skip_today:"input_boolean.jacuzzi_hoy_no",filter_min:"input_number.jacuzzi_depuracion_minima",filter_today:"sensor.jacuzzi_depuracion_hoy"},xt=new Set(["unavailable","unknown"]);function wt(t){if(null==t||""===t)return null;const e=Number(t);return Number.isFinite(e)?e:null}function At(t){return!!t&&!xt.has(t.state)}function kt(t){return At(t)?wt(t.state):null}function St(t,e){return e?t[e]:void 0}function zt(t,e){if("off"===St(t,e.power_switch)?.state)return"no_power";const n=St(t,e.connection);if(!!e.connection&&"on"!==n?.state){const n=kt(St(t,e.power));return null!==n&&n<1?"rcd_tripped":"board_offline"}return At(t[e.climate])?"ok":"board_offline"}const Et={no_power:{icon:"mdi:power-plug-off",title:"Sin corriente",detail:"Enchufe del jacuzzi apagado"},rcd_tripped:{icon:"mdi:flash-alert",title:"Sin corriente en la bomba",detail:"Rearma el diferencial del cable del jacuzzi"},board_offline:{icon:"mdi:wifi-off",title:"Placa WiFi sin conexión",detail:"La bomba tiene corriente pero la placa no responde"}};function Pt(t,e){const n=new Date(e.getTime()+6e4*Math.round(60*t)),i=`${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`;return n.toDateString()===e.toDateString()?`a las ${i}`:`mañana a las ${i}`}function Mt(t){return String(Math.round(t)).replace(/\B(?=(\d{3})+(?!\d))/g,".")}function Ct(t){let e=wt(t.min_temp)??20,n=wt(t.max_temp)??40;e>=n&&(e=20,n=40);const i=wt(t.target_temp_step);return{min:e,max:n,step:null!==i&&i>0?i:1}}function jt(t,e,n){return t?null!==e&&e===t.value||n-t.at>1e4?null:t.value:null}function Ot(t){const e=Math.round(10*t)/10;return(Number.isInteger(e)?String(e):e.toFixed(1)).replace(".",",")}const Ut=210,Tt=80;function Rt(t,e,n,i){const o=(i-90)*Math.PI/180;return{x:t+n*Math.cos(o),y:e+n*Math.sin(o)}}function Nt(t,e,n,i,o){const s=Rt(t,e,n,o),r=Rt(t,e,n,i),a=o-i<=180?"0":"1";return`M ${s.x} ${s.y} A ${n} ${n} 0 ${a} 0 ${r.x} ${r.y}`}function Ht(t,e,n,i){const o=Math.round(t/i)*i;return Number(Math.min(n,Math.max(e,o)).toFixed(2))}function It(t,e,n){const i=Math.min(1,Math.max(0,(t-e)/(n-e)));return Ut+300*i}function Dt(t,e,n,i){return Ht(e+function(t){let e;return e=t>=Ut?(t-Ut)/300:t<=150?(t+360-Ut)/300:t-150<Ut-t?1:0,Math.min(1,Math.max(0,e))}(t)*(n-e),e,n,i)}function Lt(t,e){let n=180*Math.atan2(e,t)/Math.PI+90;return n<0&&(n+=360),n}function Bt(t){const e=new Set(t),n={};for(const[t,i]of Object.entries($t))e.has(i)&&(n[t]=i);const i=n.climate??t.find(t=>t.startsWith("climate.")&&t.includes("layzspa"))??$t.climate;return{...n,climate:i}}const Wt=["Hoy","Siempre"];function Ft(t,e){return!!(e.planner&&e.usage&&e.desired&&e.maintenance)&&"on"===t[e.planner]?.state}function qt(t,e){return!!e.usage&&Wt.includes(t[e.usage]?.state??"")}function Vt(t,e){return!!e.skip_today&&"on"===t[e.skip_today]?.state}function Jt(t,e){return qt(t,e)&&!Vt(t,e)}function Zt(t){return Ct({min_temp:t.min,max_temp:t.max,target_temp_step:t.step})}function Gt(t,e){if(Ft(t,e)){const n=Jt(t,e),i=n?e.desired:e.maintenance,o=t[i],{min:s,max:r,step:a}=Zt(o?.attributes??{});return{kind:"helper",entity:i,value:kt(o),min:s,max:r,step:a,caption:n?"deseada":"mantenimiento"}}const n=t[e.climate],{min:i,max:o,step:s}=Ct(n?.attributes??{});return{kind:"climate",entity:e.climate,value:wt(n?.attributes.temperature),min:i,max:o,step:s,caption:null}}function Yt(t,e){if(!e.plan||!Ft(t,e))return null;const n=t[e.plan]?.state??"";if(!n.startsWith("{"))return null;let i;try{i=JSON.parse(n)}catch{return null}return{text:String(i.m??""),heating:"calentar"===i.a,filtering:"depurar"===i.a,grid:!0===i.r,observing:!!e.observe&&"on"===t[e.observe]?.state,rule:Number(i.n??-1),ask:!0===i.i,kept:!0===i.k,forced:!0===i.c}}function Kt(t,e){if(!Ft(t,e)||!Jt(t,e))return null;const n=e.maintenance,i=t[n],{min:o,max:s,step:r}=Zt(i?.attributes??{});return{entity:n,value:kt(i),min:o,max:s,step:r}}function Xt(t,e){if(!e.ready_time||!Ft(t,e)||!Jt(t,e))return null;const n=t[e.ready_time];return At(n)&&/^\d{2}:\d{2}/.test(n.state)?{entity:e.ready_time,value:n.state.slice(0,5)}:null}function Qt(t,e,n){const i=e[n];if(!i||!Ft(t,e))return null;const o=t[i];return At(o)&&/^\d{2}:\d{2}/.test(o.state)?{entity:i,value:o.state.slice(0,5)}:null}function te(t,e){const n=e.filter_min;if(!n||!Ft(t,e)||!At(t[n]))return null;const i=t[n].attributes;return{entity:n,value:kt(t[n]),min:wt(i.min)??0,max:wt(i.max)??12,step:wt(i.step)??.5,today:kt(e.filter_today?t[e.filter_today]:void 0)}}function ee(t){const e=Math.round(60*t),n=Math.floor(e/60),i=e%60;return i?`${n} h ${String(i).padStart(2,"0")}`:`${n} h`}function ne(t,e){return{domain:"input_boolean",service:e?"turn_on":"turn_off",data:{entity_id:t}}}const ie=[{name:"name",selector:{text:{}}},{name:"climate",required:!0,selector:{entity:{domain:"climate"}}},{name:"bubbles",selector:{entity:{domain:"switch"}}},{name:"heater",selector:{entity:{domain:"binary_sensor"}}},{name:"ready",selector:{entity:{domain:"binary_sensor"}}},{name:"time_to_ready",selector:{entity:{domain:"sensor"}}},{name:"ambient",selector:{entity:{domain:["number","sensor"]}}},{name:"error",selector:{entity:{domain:"sensor"}}},{name:"connection",selector:{entity:{domain:"binary_sensor"}}},{name:"power_switch",selector:{entity:{domain:"switch"}}},{name:"power",selector:{entity:{domain:"sensor"}}},{name:"energy_today",selector:{entity:{domain:"sensor"}}},{name:"usage",selector:{entity:{domain:"input_select"}}},{name:"desired",selector:{entity:{domain:"input_number"}}},{name:"maintenance",selector:{entity:{domain:"input_number"}}},{name:"plan",selector:{entity:{domain:"sensor"}}},{name:"planner",selector:{entity:{domain:"input_boolean"}}},{name:"observe",selector:{entity:{domain:"input_boolean"}}},{name:"grid_extra",selector:{entity:{domain:"sensor"}}},{name:"ready_time",selector:{entity:{domain:"input_datetime"}}},{name:"answer_script",selector:{entity:{domain:"script"}}},{name:"ready_until",selector:{entity:{domain:"input_datetime"}}},{name:"ready_time_workday",selector:{entity:{domain:"input_datetime"}}},{name:"ready_time_holiday",selector:{entity:{domain:"input_datetime"}}},{name:"skip_today",selector:{entity:{domain:"input_boolean"}}},{name:"filter_min",selector:{entity:{domain:"input_number"}}},{name:"filter_today",selector:{entity:{domain:"sensor"}}}],oe={name:"Nombre",climate:"Termostato del jacuzzi (climate)",bubbles:"Burbujas (switch)",heater:"Resistencia calentando (binary_sensor)",ready:"Agua lista (binary_sensor)",time_to_ready:"Tiempo hasta listo, en horas (sensor)",ambient:"Temperatura ambiente",error:"Código de error de la bomba (sensor)",connection:"Placa WiFi conectada (binary_sensor)",power_switch:"Enchufe del jacuzzi, solo lectura (switch)",power:"Potencia real en W (sensor)",energy_today:"Energía de hoy (sensor)",usage:"Planificador: uso No/Hoy/Siempre (input_select)",desired:"Planificador: temperatura deseada (input_number)",maintenance:"Planificador: temperatura de mantenimiento (input_number)",plan:"Planificador: plan en JSON (sensor)",planner:"Planificador: encendido (input_boolean)",observe:"Planificador: modo observar (input_boolean)",grid_extra:"Importación extra de red en W (sensor)",ready_time:"Planificador: hora de listo de hoy (input_datetime)",answer_script:"Planificador: respuesta al aviso de «no llega» (script)",ready_until:"Planificador: baño hasta (input_datetime)",ready_time_workday:"Planificador: hora del baño por defecto, laborables (input_datetime)",ready_time_holiday:"Planificador: hora del baño por defecto, fines de semana y festivos (input_datetime)",skip_today:"Planificador: hoy no lo uso, solo mantenimiento hasta medianoche (input_boolean)",filter_min:"Planificador: depuración mínima diaria, en horas (input_number)",filter_today:"Planificador: horas de bomba de hoy (sensor)"};let se=class extends lt{constructor(){super(...arguments),this._computeLabel=t=>oe[t.name]??t.name}setConfig(t){this._config=t}render(){return this.hass&&this._config?F`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${ie}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
      <p class="hint">Solo el termostato es obligatorio; lo que falte se oculta en la tarjeta. Con el planificador encendido, el dial edita la temperatura deseada o la de mantenimiento.</p>
    `:J}_valueChanged(t){bt(this,"config-changed",{config:t.detail.value})}};se.styles=r`
    .hint {
      color: var(--secondary-text-color);
      font-size: 0.85em;
      margin-top: 8px;
    }
  `,t([mt({attribute:!1})],se.prototype,"hass",void 0),t([ft()],se.prototype,"_config",void 0),se=t([pt(vt)],se),console.info("%c LAY-Z-SPA-CARD %c v0.2.11 ","color: white; background: #ff8100; font-weight: 700;","color: #ff8100; background: #1c1c1c; font-weight: 700;"),window.customCards=window.customCards||[],window.customCards.push({type:yt,name:"Lay-Z-Spa Card",description:"Gestión del jacuzzi: temperatura, modos, burbujas, tiempo hasta listo y consumo",preview:!0});const re="#6f7176",ae={off:{icon:"mdi:power",label:"Apagado",color:re,dot:"#4a4b4f"},fan_only:{icon:"mdi:fan",label:"Filtro",color:"#2b9af9",dot:"#15578f"},heat:{icon:"mdi:fire",label:"Calor",color:"#ff8100",dot:"#9c4e00"}},ce=["off","fan_only","heat"];let le=class extends lt{constructor(){super(...arguments),this._dragging=!1,this._dragTemp=null,this._pending=null,this._pendingEntity=null,this._settingsOpen=!1,this._valueAngle=0,this._dragPointerId=null,this._boundMove=t=>this._onPointerMove(t),this._boundUp=t=>this._onPointerUp(t),this._toggleBubbles=()=>{this.config.bubbles&&this.hass.callService("switch","toggle",{entity_id:this.config.bubbles})},this._togglePlanner=()=>{this.config.planner&&this.hass.callService("input_boolean","toggle",{entity_id:this.config.planner})},this._toggleSettings=()=>{this._settingsOpen=!this._settingsOpen}}static async getConfigElement(){return document.createElement(vt)}static getStubConfig(t){return{name:"Jacuzzi",...Bt(t?Object.keys(t.states):[])}}setConfig(t){if(!t.climate)throw new Error("Falta 'climate'");this.config={...t}}getCardSize(){return 6}disconnectedCallback(){super.disconnectedCallback(),this._removeWindowListeners()}get _states(){return this.hass.states}render(){if(!this.hass||!this.config)return J;const t=this._states,e=t[this.config.climate];if(!e)return F`<ha-card><div class="warn">Entidad no encontrada: ${this.config.climate}</div></ha-card>`;const n=zt(t,this.config),i="ok"===n,o=e.state,s=ae[o],r=i&&s?s.color:re,a=i&&s?s.dot:"#4a4b4f",c=Gt(t,this.config),{min:l,max:d}=c,p=jt(this._pendingFor(c.entity),c.value,Date.now()),u=function(t,e,n){return t??e??n}(this._dragTemp,p,c.value),h=i?wt(e.attributes.current_temperature):null,m=i&&!!this.config.heater&&"on"===t[this.config.heater]?.state,f=null!==u,g=It(u??l,l,d);this._valueAngle=f?g%360:-999;const _=Rt(100,100,Tt,g),b=null!==h?It(h,l,d):null,y=null!==b?Rt(100,100,Tt,b):null,v=null!==b?Math.min(g,b):Ut,$=null!==b?Math.max(g,b):g,x=`grad-${o}`,w=s?"heat"===o&&m?"Calentando":s.label:o,A=kt(this.config.power?t[this.config.power]:void 0),k=function(t,e){const n=e.planner?t[e.planner]:void 0;return e.planner&&At(n)?{entity:e.planner,on:"on"===n.state}:null}(t,this.config);return F`
      <ha-card style="--accent:${r}">
        <div class="header">
          <span class="title"><ha-icon icon="mdi:hot-tub"></ha-icon>${this.config.name??"Jacuzzi"}</span>
          <span class="header-center">
            ${k?F`<button
                  class="planner-toggle ${k.on?"on":""}"
                  title=${k.on?"Planificador encendido: tócalo para apagarlo":"Planificador apagado: tócalo para encenderlo"}
                  @click=${this._togglePlanner}
                >
                  <ha-icon icon=${k.on?"mdi:robot":"mdi:robot-off"}></ha-icon>Planificador
                </button>`:J}
          </span>
          <span class="header-right">
          ${null!==A?F`<button
                class="power"
                title="Consumo real"
                @click=${()=>this._openMoreInfo(this.config.energy_today||this.config.power)}
              >
                <ha-icon icon="mdi:flash"></ha-icon>${Mt(A)} W
              </button>`:J}
          </span>
        </div>

        <div class="dial-wrap">
          <svg viewBox="0 0 200 200" class="dial" @pointerdown=${this._onPointerDown}>
            <defs>
              <linearGradient id=${x} x1="0" y1="0" x2="1" y2="1">
                ${"fan_only"===o?q`<stop offset="0%" stop-color="#5cc6ff" /><stop offset="100%" stop-color="#1f7fd6" />`:"heat"===o?q`<stop offset="0%" stop-color="#ffb454" /><stop offset="100%" stop-color="#e8730a" />`:q`<stop offset="0%" stop-color="#8a8c91" /><stop offset="100%" stop-color="#5d5f63" />`}
              </linearGradient>
            </defs>
            <path class="track" d=${Nt(100,100,Tt,Ut,510)} />
            ${i&&f?q`
                <path class="glow" style="stroke:${r}" d=${Nt(100,100,Tt,v,$)} />
                <path class="value" style="stroke:url(#${x})" d=${Nt(100,100,Tt,v,$)} />
                ${y?q`<circle class="curdot" style="fill:${a}" cx=${y.x} cy=${y.y} r="4" />`:J}
                <circle class="handle ${m?"pulse":""}" style="stroke:${r}" cx=${_.x} cy=${_.y} r="8" />`:J}
          </svg>
          <div class="dial-center">${i?this._renderCenter(w,u,h,c.caption):this._renderUnavailable(n)}</div>
        </div>

        ${i?this._renderInfo():J} ${i?this._renderPlanner():J}
        ${this._renderModes(i,o,e.attributes.hvac_modes)}
      </ha-card>
    `}_renderCenter(t,e,n,i){return F`
      <div class="center-tap clickable" title="Ver detalle" @click=${()=>this._openMoreInfo(this.config.climate)}>
        <div class="mode-name">${t}</div>
        <div class="target">
          <span class="int">${null!==e?Math.round(e):"--"}</span><span class="unit">°C</span>
        </div>
        ${i?F`<div class="caption">${i}</div>`:J}
      </div>
      ${null!==n?F`<div class="current clickable" title="Ver histórico" @click=${()=>this._openMoreInfo(this.config.climate)}>
            <ha-icon icon="mdi:water-thermometer"></ha-icon>${Ot(n)} °C
          </div>`:J}
      <div class="adjust">
        <button class="round" @click=${()=>this._step(-1)}><ha-icon icon="mdi:minus"></ha-icon></button>
        <button class="round" @click=${()=>this._step(1)}><ha-icon icon="mdi:plus"></ha-icon></button>
      </div>
    `}_renderUnavailable(t){const e=Et[t];return F`
      <ha-icon class="unavail-icon" icon=${e.icon}></ha-icon>
      <div class="unavail-title">${e.title}</div>
      <div class="unavail-detail">${e.detail}</div>
    `}_renderInfo(){const t=this._states,e=kt(this.config.ambient?t[this.config.ambient]:void 0),n=t[this.config.climate],i=n?wt(n.attributes.current_temperature):null,o=function(t,e,n){return"helper"!==e.kind||"ready"!==t.kind?t:null===n||null===e.value||n<e.value?{kind:"none"}:t}(function(t,e,n=new Date){const i=t[e.climate];if(!i||"heat"!==i.state)return{kind:"none"};const o=St(t,e.ready);if(At(o)){if("on"===o.state)return{kind:"ready"}}else{const t=wt(i.attributes.current_temperature),e=wt(i.attributes.temperature);if(null!==t&&null!==e&&t>=e)return{kind:"ready"}}const s=kt(St(t,e.time_to_ready));return null===s||s<=0||s>96?{kind:"none"}:{kind:"eta",text:Pt(s,n)}}(t,this.config),Gt(t,this.config),i),s=function(t,e){const n=kt(St(t,e.error));return null===n||0===n?null:`E${String(Math.trunc(n)).padStart(2,"0")}`}(t,this.config),r=function(t,e){const n=kt(e.grid_extra?t[e.grid_extra]:void 0);return null!==n&&n>0?n:null}(t,this.config);return F`
      <div class="info">
        ${null!==e?F`<span class="item clickable" @click=${()=>this._openMoreInfo(this.config.ambient)}>
              <ha-icon icon="mdi:home-thermometer-outline"></ha-icon>Amb. ${Ot(e)} °C
            </span>`:J}
        ${null!==r?F`<span class="item grid-extra clickable" title="Importando de la red para el jacuzzi (sin batería)" @click=${()=>this._openMoreInfo(this.config.grid_extra)}>
              <ha-icon icon="mdi:transmission-tower-import"></ha-icon>+${Mt(r)} W red
            </span>`:J}
        ${"ready"===o.kind?F`<span class="chip ready"><ha-icon icon="mdi:check-circle"></ha-icon>Listo</span>`:"eta"===o.kind?F`<span class="item clickable" @click=${()=>this._openMoreInfo(this.config.time_to_ready)}>
              <ha-icon icon="mdi:timer-sand"></ha-icon>Listo ${o.text}
            </span>`:J}
      </div>
      ${s?F`<div class="warnings"><span class="chip error"><ha-icon icon="mdi:alert"></ha-icon>Error ${s}</span></div>`:J}
    `}_renderModes(t,e,n){const i=Array.isArray(n)?n:ce,o=function(t,e){if(!e.bubbles)return"none";const n=t[e.bubbles];return At(n)?"on"===n.state?"on":"off":"unavailable"}(this._states,this.config);return F`
      <div class="bar">
        <div class="modes">
          ${ce.filter(t=>i.includes(t)).map(n=>{const i=ae[n];return F`<button
              class="mode ${t&&e===n?"active":""}"
              style="--mode-color:${i.color}"
              title=${i.label}
              ?disabled=${!t}
              @click=${()=>this._setMode(n)}
            >
              <ha-icon icon=${i.icon}></ha-icon>
            </button>`})}
        </div>
        ${"none"!==o?F`<button
              class="bubbles ${t&&"on"===o?"active":""}"
              title=${"unavailable"===o?"Burbujas sin datos":"Burbujas"}
              ?disabled=${!t||"unavailable"===o}
              @click=${this._toggleBubbles}
            >
              <ha-icon icon="mdi:chart-bubble"></ha-icon>
            </button>`:J}
      </div>
    `}_setMode(t){this.hass.callService("climate","set_hvac_mode",{entity_id:this.config.climate,hvac_mode:t})}_pendingFor(t){return this._pendingEntity===t?this._pending:null}_step(t){const e=Gt(this._states,this.config),{min:n,max:i,step:o}=e,s=jt(this._pendingFor(e.entity),e.value,Date.now())??e.value??n,r=Ht(s+t*o,n,i,o);r!==s&&this._sendTarget(r)}_sendTarget(t){const e=Gt(this._states,this.config);this._pending={value:t,at:Date.now()},this._pendingEntity=e.entity;const n=function(t,e){return"helper"===t.kind?{domain:"input_number",service:"set_value",data:{entity_id:t.entity,value:e}}:{domain:"climate",service:"set_temperature",data:{entity_id:t.entity,temperature:e}}}(e,t);this.hass.callService(n.domain,n.service,n.data)}_renderPlanner(){const t=this._states,e=Yt(t,this.config),n=function(t,e){if(!Ft(t,e))return null;const n=e.usage?t[e.usage]:void 0;if(!At(n))return null;const i=Array.isArray(n.attributes.options)?n.attributes.options.map(String):[];return{current:n.state,options:i}}(t,this.config),i=Kt(t,this.config),o=Xt(t,this.config),s=function(t,e){const n=Yt(t,e);if(!n||n.observing||!e.answer_script||!At(t[e.answer_script]))return null;const i=n.ask?"ask":n.kept?"kept":n.forced?"forced":null;return i?{script:e.answer_script,mode:i}:null}(t,this.config),r=function(t,e,n){const i=e.skip_today;if(!(i&&Ft(t,e)&&At(t[i])&&Jt(t,e)))return null;const o=Xt(t,e);if(!o)return null;const[s,r]=o.value.split(":").map(Number);return 60*n.getHours()+n.getMinutes()>=60*s+r-30?{entity:i}:null}(t,this.config,new Date),a=Qt(t,this.config,"ready_until"),c=Qt(t,this.config,"ready_time_workday"),l=Qt(t,this.config,"ready_time_holiday"),d=function(t,e){const n=e.skip_today;if(!n||!Ft(t,e)||!At(t[n]))return null;const i=Vt(t,e);return i||qt(t,e)?{entity:n,on:i}:null}(t,this.config),p=te(t,this.config),u=!!(i||o||a||c||l||d||p);return e||n||u?F`
      ${e?F`<div class="plan ${e.observing?"observing":""} clickable" title="Plan del jacuzzi" @click=${()=>this._openMoreInfo(this.config.plan)}>
            <ha-icon icon=${e.observing?"mdi:eye":e.filtering?"mdi:air-filter":"mdi:robot"}></ha-icon>
            <span>${e.observing?"Observando: ":""}${e.text}${e.grid?" · red":""}</span>
          </div>`:J}
      ${s||r?F`<div class="answer">
            ${s&&"forced"!==s.mode?F`<button class="heat" @click=${()=>this._answer(s.script,"jacuzzi_calentar")}>
                  <ha-icon icon="mdi:fire"></ha-icon>Calentar igualmente
                </button>`:J}
            ${s&&"kept"!==s.mode?F`<button @click=${()=>this._answer(s.script,"jacuzzi_mantener")}>
                  <ha-icon icon="mdi:snowflake"></ha-icon>Mantener
                </button>`:J}
            ${r?F`<button title="Solo mantenimiento hasta medianoche; mañana vuelve el uso de siempre" @click=${()=>this._finish(r.entity)}>
                  <ha-icon icon="mdi:check-circle-outline"></ha-icon>Hemos terminado
                </button>`:J}
          </div>`:J}
      ${n?F`<div class="usage">
            ${n.options.map(t=>F`<button class="${t===n.current?"active":""}" @click=${()=>this._setUsage(t)}>${t}</button>`)}
          </div>`:J}
      ${u?F`<div class="settings ${this._settingsOpen?"open":""}">
            <button class="settings-toggle" aria-expanded=${this._settingsOpen?"true":"false"} @click=${this._toggleSettings}>
              <ha-icon icon="mdi:tune-variant"></ha-icon>
              <span class="setting-label">${this._settingsOpen?"Ajustes":function(t,e,n=null,i=!1,o=null){const s=[];return i&&s.push("Hoy no se usa"),t&&s.push(`Mant. ${null!==t.value?Ot(t.value):"--"} °C`),e&&s.push(`Baño ${e.value}${n&&"00:00"!==n.value?`–${n.value}`:""}`),o&&o.value&&s.push(`Dep. ${ee(o.value)}`),s.join(" · ")}(i,o,a,!!d?.on,p)||"Horas del baño"}</span>
              <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
            </button>
            ${this._settingsOpen&&d?F`<div class="setting">
                  <ha-icon icon="mdi:calendar-remove"></ha-icon>
                  <span class="setting-label">Hoy no lo uso</span>
                  <ha-switch .checked=${d.on} @change=${t=>this._setSkipToday(d.entity,t)}></ha-switch>
                </div>`:J}
            ${this._settingsOpen&&i?F`<div class="setting">
                  <ha-icon icon="mdi:wrench-outline"></ha-icon>
                  <span class="setting-label">Mantenimiento</span>
                  <div class="pill">
                    <button class="pill-btn" title="Bajar" @click=${()=>this._stepMaintenance(-1)}><ha-icon icon="mdi:minus"></ha-icon></button>
                    <span class="pill-value">${null!==i.value?Ot(i.value):"--"} °C</span>
                    <button class="pill-btn" title="Subir" @click=${()=>this._stepMaintenance(1)}><ha-icon icon="mdi:plus"></ha-icon></button>
                  </div>
                </div>`:J}
            ${this._settingsOpen&&p?F`<div class="setting">
                  <ha-icon icon="mdi:air-filter"></ha-icon>
                  <span class="setting-label">Depuración mínima${null!==p.today?F`<span class="setting-sub">hoy ${ee(p.today)}</span>`:J}</span>
                  <div class="pill">
                    <button class="pill-btn" title="Menos" @click=${()=>this._stepFilter(-1)}><ha-icon icon="mdi:minus"></ha-icon></button>
                    <span class="pill-value">${null!==p.value?ee(p.value):"--"}</span>
                    <button class="pill-btn" title="Más" @click=${()=>this._stepFilter(1)}><ha-icon icon="mdi:plus"></ha-icon></button>
                  </div>
                </div>`:J}
            ${this._settingsOpen?this._timeRow("mdi:clock-outline","Baño hoy a las",o):J}
            ${this._settingsOpen?this._timeRow("mdi:clock-end","Baño hasta",a):J}
            ${this._settingsOpen?this._timeRow("mdi:briefcase-outline","Laborables",c):J}
            ${this._settingsOpen?this._timeRow("mdi:party-popper","Festivos y finde",l):J}
          </div>`:J}
    `:J}_answer(t,e){const n=function(t,e,n){return{domain:"script",service:"turn_on",data:{entity_id:t,variables:{respuesta:e,quien:n||"Alguien"}}}}(t,e,this.hass.user?.name);this.hass.callService(n.domain,n.service,n.data)}_setUsage(t){this.config.usage&&this.hass.callService("input_select","select_option",{entity_id:this.config.usage,option:t})}_finish(t){const e=ne(t,!0);this.hass.callService(e.domain,e.service,e.data)}_setSkipToday(t,e){const n=ne(t,e.target.checked);this.hass.callService(n.domain,n.service,n.data)}_timeRow(t,e,n){return n?F`<div class="setting">
      <ha-icon icon=${t}></ha-icon>
      <span class="setting-label">${e}</span>
      <div class="pill">
        <input class="ready-time" type="time" step="900" .value=${n.value} @change=${t=>this._setTime(n.entity,t)} />
      </div>
    </div>`:J}_setTime(t,e){const n=e.target.value;/^\d{2}:\d{2}$/.test(n)&&this.hass.callService("input_datetime","set_datetime",{entity_id:t,time:`${n}:00`})}_stepMaintenance(t){const e=Kt(this._states,this.config);if(!e||null===e.value)return;const n=Ht(e.value+t*e.step,e.min,e.max,e.step);n!==e.value&&this.hass.callService("input_number","set_value",{entity_id:e.entity,value:n})}_stepFilter(t){const e=te(this._states,this.config);if(!e||null===e.value)return;const n=Math.min(e.max,Math.max(e.min,Math.round((e.value+t*e.step)/e.step)*e.step));n!==e.value&&this.hass.callService("input_number","set_value",{entity_id:e.entity,value:n})}_openMoreInfo(t){t&&this.hass?.states[t]&&bt(this,"hass-more-info",{entityId:t})}_svg(){return this.renderRoot.querySelector("svg.dial")}_onPointerDown(t){if("ok"!==zt(this._states,this.config))return;const e=this._svg();if(!e)return;const n=e.getBoundingClientRect();if(!n.width)return;if(function(t,e,n,i){const o=Math.hypot(t,e);if(Math.abs(o-Tt*n)>21*n)return!1;let s=Math.abs(Lt(t,e)-i);return s>180&&(s=360-s),s<=22}(t.clientX-(n.left+n.width/2),t.clientY-(n.top+n.height/2),n.width/200,this._valueAngle)){t.preventDefault(),this._dragging=!0,this._dragPointerId=t.pointerId;try{e.setPointerCapture(t.pointerId)}catch(t){}window.addEventListener("pointermove",this._boundMove),window.addEventListener("pointerup",this._boundUp),window.addEventListener("pointercancel",this._boundUp)}}_onPointerMove(t){if(!this._dragging||t.pointerId!==this._dragPointerId)return;t.cancelable&&t.preventDefault();const e=this._svg();if(!e)return;const n=e.getBoundingClientRect(),i=Lt(t.clientX-(n.left+n.width/2),t.clientY-(n.top+n.height/2)),{min:o,max:s,step:r}=Gt(this._states,this.config);this._dragTemp=Dt(i,o,s,r)}_onPointerUp(t){if(!this._dragging||t.pointerId!==this._dragPointerId)return;if(this._dragging=!1,this._removeWindowListeners(),null!==this._dragPointerId){try{this._svg()?.releasePointerCapture(this._dragPointerId)}catch(t){}this._dragPointerId=null}const e=Gt(this._states,this.config),n=jt(this._pendingFor(e.entity),e.value,Date.now())??e.value,i=function(t,e,n){return n&&null!==t&&t!==e?t:null}(this._dragTemp,n,"ok"===zt(this._states,this.config));null!==i&&this._sendTarget(i),this._dragTemp=null}_removeWindowListeners(){window.removeEventListener("pointermove",this._boundMove),window.removeEventListener("pointerup",this._boundUp),window.removeEventListener("pointercancel",this._boundUp)}};le.styles=r`
    ha-card {
      padding: 12px 12px 16px;
      color: var(--primary-text-color);
    }
    .warn {
      padding: 16px;
      color: var(--error-color, #db4437);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2px 4px 0;
    }
    .title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 1.05rem;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .title ha-icon {
      --mdc-icon-size: 20px;
    }
    button.power {
      display: flex;
      align-items: center;
      gap: 2px;
      border: none;
      background: transparent;
      color: var(--secondary-text-color);
      font-size: 0.9rem;
      cursor: pointer;
      font-variant-numeric: tabular-nums;
    }
    button.power ha-icon {
      --mdc-icon-size: 16px;
    }

    .dial-wrap {
      position: relative;
      width: 100%;
      max-width: 300px;
      margin: 4px auto 0;
      aspect-ratio: 1 / 1;
    }
    .dial {
      width: 100%;
      height: 100%;
      touch-action: none;
    }
    .track {
      fill: none;
      stroke: var(--divider-color, #38393d);
      stroke-width: 18;
      stroke-linecap: round;
    }
    .glow {
      fill: none;
      stroke-width: 18;
      stroke-linecap: round;
      opacity: 0.45;
      filter: blur(6px);
    }
    .value {
      fill: none;
      stroke-width: 18;
      stroke-linecap: round;
    }
    .handle {
      fill: #fff;
      stroke-width: 3;
      cursor: grab;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
    }
    .handle.pulse {
      animation: pulse 1.6s ease-in-out infinite;
    }
    @keyframes pulse {
      0%,
      100% {
        stroke-width: 3;
      }
      50% {
        stroke-width: 6;
      }
    }
    .dial-center {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      pointer-events: none;
      text-align: center;
      padding: 0 22%;
    }
    .center-tap {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .mode-name {
      font-size: 1.05rem;
      color: var(--accent);
      font-weight: 600;
    }
    .target {
      display: flex;
      align-items: flex-start;
      line-height: 1;
    }
    .target .int {
      font-size: 3.6rem;
      font-weight: 300;
      letter-spacing: -1px;
    }
    .target .unit {
      font-size: 1.05rem;
      color: var(--secondary-text-color);
      margin-top: 8px;
      margin-left: 2px;
    }
    .current {
      font-size: 0.95rem;
      color: var(--accent);
      display: flex;
      align-items: center;
      gap: 3px;
    }
    .current ha-icon,
    .item ha-icon,
    .chip ha-icon {
      --mdc-icon-size: 16px;
    }
    .clickable {
      cursor: pointer;
      pointer-events: auto;
    }
    .adjust {
      display: flex;
      gap: 24px;
      margin-top: 8px;
      pointer-events: auto;
    }
    button.round {
      border: 2px solid var(--divider-color, #46494d);
      border-radius: 50%;
      width: 44px;
      height: 44px;
      cursor: pointer;
      background: transparent;
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .unavail-icon {
      --mdc-icon-size: 36px;
      color: var(--secondary-text-color);
    }
    .unavail-title {
      font-size: 1.1rem;
      font-weight: 600;
    }
    .unavail-detail {
      font-size: 0.85rem;
      color: var(--secondary-text-color);
    }

    .info {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 14px;
      margin-top: 4px;
      font-size: 0.92rem;
      color: var(--secondary-text-color);
    }
    .item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .warnings {
      display: flex;
      justify-content: center;
      margin-top: 6px;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.85rem;
      padding: 2px 10px;
      border-radius: 12px;
      color: #fff;
    }
    .chip.ready {
      background: #43a047;
    }
    .chip.error {
      background: var(--error-color, #db4437);
    }

    .bar {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }
    .modes {
      flex: 1;
      display: flex;
      gap: 6px;
      background: var(--secondary-background-color, #2a2a2a);
      border-radius: 14px;
      padding: 4px;
    }
    .mode,
    .bubbles {
      flex: 1;
      border: none;
      background: transparent;
      color: var(--secondary-text-color);
      padding: 8px;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .bubbles {
      flex: 0 0 56px;
      background: var(--secondary-background-color, #2a2a2a);
      border-radius: 14px;
    }
    .mode.active {
      background: var(--mode-color);
      color: #fff;
    }
    .bubbles.active {
      background: #26a69a;
      color: #fff;
    }
    .mode:disabled,
    .bubbles:disabled {
      opacity: 0.35;
      cursor: default;
    }

    /* PLANIFICADOR (v0.2.0) */
    /* Cabecera en tres columnas: nombre | botón del planificador centrado | potencia (v0.2.1) */
    .header {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 6px;
    }
    .title {
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .header-center {
      display: flex;
      justify-content: center;
    }
    .header-right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 4px;
    }
    button.planner-toggle {
      display: flex;
      align-items: center;
      gap: 4px;
      border: 1px solid var(--divider-color, #46494d);
      border-radius: 14px;
      background: transparent;
      color: var(--secondary-text-color);
      padding: 2px 10px;
      font-size: 0.8rem;
      cursor: pointer;
    }
    button.planner-toggle ha-icon {
      --mdc-icon-size: 16px;
    }
    button.planner-toggle.on {
      border-color: transparent;
      background: var(--primary-color, #03a9f4);
      color: #fff;
    }
    .grid-extra {
      color: #26a69a;
    }
    button.power {
      white-space: nowrap;
    }
    .caption {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      margin-top: -2px;
    }
    .plan {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: 8px;
      font-size: 0.88rem;
      color: var(--primary-text-color);
      text-align: center;
    }
    .plan ha-icon {
      --mdc-icon-size: 16px;
      color: var(--accent);
      flex: 0 0 auto;
    }
    .plan.observing {
      color: var(--secondary-text-color);
      font-style: italic;
    }
    .plan.observing ha-icon {
      color: var(--secondary-text-color);
    }
    .answer {
      display: flex;
      gap: 6px;
      margin-top: 8px;
    }
    .answer button {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      border: 1px solid var(--divider-color, #444);
      background: var(--secondary-background-color, #2a2a2a);
      color: var(--primary-text-color);
      padding: 6px 4px;
      border-radius: 9px;
      cursor: pointer;
      font-size: 0.85rem;
    }
    .answer button.heat {
      /* Naranja de calor fijo: el --accent es gris con el jacuzzi apagado y parecería desactivado */
      border-color: var(--state-climate-heat-color, #ff8100);
      color: var(--state-climate-heat-color, #ff8100);
    }
    .answer ha-icon {
      --mdc-icon-size: 16px;
    }
    .usage {
      display: flex;
      gap: 4px;
      margin-top: 8px;
      background: var(--secondary-background-color, #2a2a2a);
      border-radius: 12px;
      padding: 3px;
    }
    .usage button {
      flex: 1;
      border: none;
      background: transparent;
      color: var(--secondary-text-color);
      padding: 6px 4px;
      border-radius: 9px;
      cursor: pointer;
      font-size: 0.85rem;
    }
    .usage button.active {
      background: var(--primary-color, #03a9f4);
      color: #fff;
    }
    .settings {
      margin-top: 8px;
      background: var(--secondary-background-color, #2a2a2a);
      border-radius: 12px;
      padding: 2px 10px;
    }
    .setting {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 40px;
      font-size: 0.85rem;
      color: var(--secondary-text-color);
    }
    .settings-toggle {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      min-height: 36px;
      padding: 0;
      border: none;
      background: transparent;
      font: inherit;
      font-size: 0.85rem;
      color: var(--secondary-text-color);
      cursor: pointer;
      text-align: left;
    }
    .settings-toggle > ha-icon {
      --mdc-icon-size: 18px;
    }
    .settings-toggle .chevron {
      transition: transform 0.2s ease;
    }
    .settings.open .settings-toggle .chevron {
      transform: rotate(180deg);
    }
    .settings-toggle + .setting,
    .setting + .setting {
      border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
    }
    .setting > ha-icon {
      --mdc-icon-size: 18px;
    }
    .setting-label {
      flex: 1;
      color: var(--primary-text-color);
    }
    .setting-sub {
      margin-left: 6px;
      font-size: 0.85em;
      color: var(--secondary-text-color);
    }
    .pill {
      display: flex;
      align-items: center;
      gap: 2px;
      background: var(--card-background-color, #1c1c1c);
      border-radius: 9px;
      padding: 3px;
    }
    .pill-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 26px;
      border: none;
      border-radius: 7px;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .pill-btn:hover {
      background: var(--secondary-background-color, #2a2a2a);
    }
    .pill-btn ha-icon {
      --mdc-icon-size: 16px;
    }
    .pill-value {
      min-width: 46px;
      text-align: center;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }
    input.ready-time {
      font: inherit;
      color: var(--primary-text-color);
      background: transparent;
      border: none;
      padding: 3px 6px;
      color-scheme: light dark;
      font-variant-numeric: tabular-nums;
    }
  `,t([mt({attribute:!1})],le.prototype,"hass",void 0),t([ft()],le.prototype,"config",void 0),t([ft()],le.prototype,"_dragging",void 0),t([ft()],le.prototype,"_dragTemp",void 0),t([ft()],le.prototype,"_pending",void 0),t([ft()],le.prototype,"_pendingEntity",void 0),t([ft()],le.prototype,"_settingsOpen",void 0),le=t([pt(yt)],le);export{le as LayZSpaCard};
