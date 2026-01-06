(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['profile_view_header'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "display:none!important;";
},"3":function(container,depth0,helpers,partials,data) {
    return "display:none;";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n<div class=\"KLM_extensionSingleProfileViewWrapperBlock\" style=\"box-sizing: border-box;float:left;width:100%;\">\n\n    <div class=\"KLM_extension_company_product_name\" style=\"background-color: #eee;font-size:13px;float:left;width:100%;border-bottom:1px solid #ddd;padding:5px 10px 5px 10px;\">\n\n                <span style=\"font-weight:bold;font-size:15px;margin: 0px 0px 0px 0px;float: left;\">\n                    "
    + alias4(((helper = (helper = lookupProperty(helpers,"companyName") || (depth0 != null ? lookupProperty(depth0,"companyName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"companyName","hash":{},"data":data,"loc":{"start":{"line":7,"column":20},"end":{"line":7,"column":35}}}) : helper)))
    + "\n                </span>\n\n                <div class=\"KLM__side__bar__profile__view__close\" style=\"margin: 10px 10px 0px 0px;\"></div>\n\n                <span style=\"float:left;width:100%;margin-top:5px;\">\n\n                \n                <span style=\"cursor:pointer;font-size:11px;float:left;\" class=\"bindRefreshListsViewKllm\"><img src=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"iconRefresh") || (depth0 != null ? lookupProperty(depth0,"iconRefresh") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"iconRefresh","hash":{},"data":data,"loc":{"start":{"line":15,"column":115},"end":{"line":15,"column":130}}}) : helper)))
    + "\" width=\"10\" height=\"10\"> "
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"translate_minibar") : depth0)) != null ? lookupProperty(stack1,"text_229") : stack1), depth0))
    + "</span>\n\n                </span>\n\n        </div>\n\n        <div class=\"\" style=\"position:relative;z-index:3;float:left;width:100%;font-size:13px;padding:5px 10px 5px 10px;\">\n            \n            <span style=\"float:left;width:100%;font-size:13px;\">\n                "
    + alias4(((helper = (helper = lookupProperty(helpers,"extra_help_step_1") || (depth0 != null ? lookupProperty(depth0,"extra_help_step_1") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"extra_help_step_1","hash":{},"data":data,"loc":{"start":{"line":24,"column":16},"end":{"line":24,"column":37}}}) : helper)))
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"translate_minibar") : depth0)) != null ? lookupProperty(stack1,"text_211") : stack1), depth0))
    + "\n                \n                <span class=\"KLM_extensionGlobalTooltip\"><img style=\"margin: 2px 3px -2px 3px;\" src=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"iconHelp") || (depth0 != null ? lookupProperty(depth0,"iconHelp") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"iconHelp","hash":{},"data":data,"loc":{"start":{"line":26,"column":101},"end":{"line":26,"column":113}}}) : helper)))
    + "\" width=\"15\" height=\"15\">\n                    <span class=\"KLM_extensionGlobalTooltipText\">"
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"translate_minibar") : depth0)) != null ? lookupProperty(stack1,"text_243") : stack1), depth0))
    + "</span>\n                </span>\n                \n                \n                <a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"companyLinkLists") || (depth0 != null ? lookupProperty(depth0,"companyLinkLists") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"companyLinkLists","hash":{},"data":data,"loc":{"start":{"line":31,"column":25},"end":{"line":31,"column":45}}}) : helper)))
    + "\" target=\"_blank\" style=\"font-size:10px;\">\n                        ("
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"translate_minibar") : depth0)) != null ? lookupProperty(stack1,"text_227") : stack1), depth0))
    + ")\n                </a>\n            </span>\n            \n            "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"customerLists") || (depth0 != null ? lookupProperty(depth0,"customerLists") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"customerLists","hash":{},"data":data,"loc":{"start":{"line":36,"column":12},"end":{"line":36,"column":31}}}) : helper))) != null ? stack1 : "")
    + "\n            \n        </div>\n\n        <div class=\"KLM__bar__information__saved__list\" style=\"\">\n\n            "
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"translate_minibar") : depth0)) != null ? lookupProperty(stack1,"text_208") : stack1), depth0))
    + " <strong class=\"KLM__bar__information__saved__list__count\"></strong> "
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"translate_minibar") : depth0)) != null ? lookupProperty(stack1,"text_209") : stack1), depth0))
    + "\n\n        </div>\n\n\n            \n           <button class=\"KLM__button__view\" id=\"KLMGlobalSingleBarSaveProfil\" style=\"margin-bottom:10px;display:none;margin-top:0px;min-height:40px;background-color:"
    + alias4(((helper = (helper = lookupProperty(helpers,"companyColor") || (depth0 != null ? lookupProperty(depth0,"companyColor") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"companyColor","hash":{},"data":data,"loc":{"start":{"line":48,"column":166},"end":{"line":48,"column":182}}}) : helper)))
    + "!important;\"><img src=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"iconSave") || (depth0 != null ? lookupProperty(depth0,"iconSave") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"iconSave","hash":{},"data":data,"loc":{"start":{"line":48,"column":205},"end":{"line":48,"column":217}}}) : helper)))
    + "\" style=\"margin: 0px 10px -4px 0px;width:15px;height:15px;\">\n                "
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"translate_minibar") : depth0)) != null ? lookupProperty(stack1,"text_211") : stack1), depth0))
    + "\n            </button>\n\n            \n            <button class=\"KLM__button__view KLMGlobalSingleBarSaveProfilChecked\" style=\"margin-bottom:10px;display:none;cursor:not-allowed!important;margin-top:0px;min-height:40px;background-color:#4caf50!important;border-color: #4caf50 !important;\"><img src=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"iconCheck") || (depth0 != null ? lookupProperty(depth0,"iconCheck") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"iconCheck","hash":{},"data":data,"loc":{"start":{"line":53,"column":261},"end":{"line":53,"column":274}}}) : helper)))
    + "\" style=\"margin: 0px 10px -4px 0px;width:15px;height:15px;\"> "
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"translate_minibar") : depth0)) != null ? lookupProperty(stack1,"text_212") : stack1), depth0))
    + "</button>\n\n\n        <span style=\""
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"has_campaign_tool") : depth0),"false",{"name":"ifCond","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":56,"column":21},"end":{"line":56,"column":92}}})) != null ? stack1 : "")
    + "\">\n            <span id=\"KLMGlobalSingleBarPushToCampaign\" style=\"display:none;position:relative;font-size:13px;float:left;width:100%;padding:0px 10px 5px 10px;\">\n                    \n                    <span style=\"position:relative;z-index:2;\">\n\n                        <span class=\"KLMSaveCampaignSingleBarEvent_1\">\n                            <input type=\"checkbox\" id=\"KLMGlobalSingleBarPushToCampaignCheck\" class=\"KLMGlobalSingleBarPushToCampaignCheck\">\n                            "
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"translate_minibar") : depth0)) != null ? lookupProperty(stack1,"text_235") : stack1), depth0))
    + "\n\n                            <a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"customerLinkCampaigns") || (depth0 != null ? lookupProperty(depth0,"customerLinkCampaigns") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"customerLinkCampaigns","hash":{},"data":data,"loc":{"start":{"line":65,"column":37},"end":{"line":65,"column":62}}}) : helper)))
    + "\" target=\"_blank\" style=\"font-size:10px;\">\n                                    ("
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"translate_minibar") : depth0)) != null ? lookupProperty(stack1,"text_227") : stack1), depth0))
    + ")\n                            </a>\n                        </span>\n\n                        <span class=\"KLMSaveCampaignSingleBarEvent_2\" style=\"display:none;\">\n                           "
    + alias4(((helper = (helper = lookupProperty(helpers,"extra_help_step_2") || (depth0 != null ? lookupProperty(depth0,"extra_help_step_2") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"extra_help_step_2","hash":{},"data":data,"loc":{"start":{"line":71,"column":27},"end":{"line":71,"column":48}}}) : helper)))
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"translate_minibar") : depth0)) != null ? lookupProperty(stack1,"text_236") : stack1), depth0))
    + "\n\n                            <span class=\"KLM_extensionGlobalTooltip\"><img style=\"margin: 2px 3px -2px 3px;\" src=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"iconHelp") || (depth0 != null ? lookupProperty(depth0,"iconHelp") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"iconHelp","hash":{},"data":data,"loc":{"start":{"line":73,"column":113},"end":{"line":73,"column":125}}}) : helper)))
    + "\" width=\"15\" height=\"15\">\n                        <span class=\"KLM_extensionGlobalTooltipText\">"
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"translate_minibar") : depth0)) != null ? lookupProperty(stack1,"text_244") : stack1), depth0))
    + "</span>\n                    </span>\n\n                           <a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"customerLinkCampaigns") || (depth0 != null ? lookupProperty(depth0,"customerLinkCampaigns") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"customerLinkCampaigns","hash":{},"data":data,"loc":{"start":{"line":77,"column":36},"end":{"line":77,"column":61}}}) : helper)))
    + "\" target=\"_blank\" style=\"font-size:10px;\">\n                                    ("
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"translate_minibar") : depth0)) != null ? lookupProperty(stack1,"text_227") : stack1), depth0))
    + ")\n                            </a>\n                        </span>\n\n                        "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"customerCampaigns") || (depth0 != null ? lookupProperty(depth0,"customerCampaigns") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"customerCampaigns","hash":{},"data":data,"loc":{"start":{"line":82,"column":24},"end":{"line":82,"column":47}}}) : helper))) != null ? stack1 : "")
    + "\n\n                        \n\n                        \n\n                    </span>\n\n\n\n\n                    <span class=\"KLMGlobalSingleBarPushToCampaignSelectEmailsWrapper\" style=\"margin-top:3px;z-index:1;float:left;width:100%;display:none;\">\n                        "
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"translate_minibar") : depth0)) != null ? lookupProperty(stack1,"text_237") : stack1), depth0))
    + "\n                        <select id=\"KLMGlobalSingleBarPushToCampaignSelectEmails\" name=\"KLMGlobalSingleBarPushToCampaignSelectEmails\" style=\"position:relative;z-index:1;\">\n                            \n                        </select>\n                    </span>\n\n                    <button class=\"KLM__button__view KLMGlobalSingleBarSaveProfilAndCampaignAction\" style=\""
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"has_campaign_tool_active") : depth0),"false",{"name":"ifCond","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":100,"column":107},"end":{"line":100,"column":175}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"has_campaigns_options_data") : depth0),"false",{"name":"ifCond","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":100,"column":175},"end":{"line":100,"column":245}}})) != null ? stack1 : "")
    + "background-color:"
    + alias4(((helper = (helper = lookupProperty(helpers,"companyColor") || (depth0 != null ? lookupProperty(depth0,"companyColor") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"companyColor","hash":{},"data":data,"loc":{"start":{"line":100,"column":262},"end":{"line":100,"column":278}}}) : helper)))
    + "!important;min-height:40px;\">"
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"translate_minibar") : depth0)) != null ? lookupProperty(stack1,"text_238") : stack1), depth0))
    + "</button>\n\n                    \n\n            </span>\n\n                    <button class=\"KLM__button__view KLMGlobalSingleBarSaveProfilAndCampaignActionExist\" style=\"display:none;cursor: not-allowed!important;min-height: 40px;background-color: #4caf50!important;border-color: #4caf50 !important;margin-top:0px;\">\n                        <img src=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"iconCheck") || (depth0 != null ? lookupProperty(depth0,"iconCheck") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"iconCheck","hash":{},"data":data,"loc":{"start":{"line":107,"column":34},"end":{"line":107,"column":47}}}) : helper)))
    + "\" style=\"margin: 0px 10px -4px 0px;width:15px;height:15px;\">\n                        "
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"translate_minibar") : depth0)) != null ? lookupProperty(stack1,"text_239") : stack1), depth0))
    + "\n                    </button>\n\n                    <span class=\"KLMNoCampaignsAvailableHelpCreate\" style=\"font-size:13px;padding:0px 10px 0px 10px;float:left;width:100%;"
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"has_campaigns_options_data") : depth0),"true",{"name":"ifCond","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":111,"column":138},"end":{"line":111,"column":207}}})) != null ? stack1 : "")
    + "color:red;\">\n                        "
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"translate_minibar") : depth0)) != null ? lookupProperty(stack1,"text_240") : stack1), depth0))
    + "<br><a style=\"color:red;\" href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"customerLinkCampaigns") || (depth0 != null ? lookupProperty(depth0,"customerLinkCampaigns") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"customerLinkCampaigns","hash":{},"data":data,"loc":{"start":{"line":112,"column":86},"end":{"line":112,"column":111}}}) : helper)))
    + "\" target=\"_blank\">"
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"translate_minibar") : depth0)) != null ? lookupProperty(stack1,"text_241") : stack1), depth0))
    + "</a>\n                    </span>\n\n        </span>\n\n</div>\n\n<div class=\"KLM_extensionSingleProfileViewWrapperBlockBindExchangeLoader\">\n        <div class=\"KLM_ph-item\">\n            <div class=\"KLM_ph-col-12\">\n                <div class=\"KLM_ph-picture\"></div>\n                <div class=\"KLM_ph-row\">\n                    <div class=\"KLM_ph-col-4\"></div>\n                    <div class=\"KLM_ph-col-8 KLM_empty\"></div>\n                    <div class=\"KLM_ph-col-12\"></div>\n                </div>\n            </div>\n            <div class=\"KLM_ph-col-2\">\n                <div class=\"KLM_ph-avatar\"></div>\n            </div>\n            <div>\n                <div class=\"KLM_ph-row\">\n                    <div class=\"KLM_ph-col-12\"></div>\n                    <div class=\"KLM_ph-col-2\"></div>\n                    <div class=\"KLM_ph-col-10 KLM_empty\"></div>\n                    <div class=\"KLM_ph-col-8 KLM_big\"></div>\n                    <div class=\"KLM_ph-col-4 KLM_big KLM_empty\"></div>\n                </div>\n            </div>\n        </div>\n</div>\n\n<div class=\"KLM_extensionSingleProfileViewWrapperBlockBindExchange\">\n\n</div>";
},"useData":true});
templates['single_profile_view'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "display:none;";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n            <div class=\"KLM_extensionSingleProfileViewWrapperBlockSingleRow\" style=\""
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"type") : depth0),"head",{"name":"ifCond","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":51,"column":84},"end":{"line":51,"column":141}}})) != null ? stack1 : "")
    + "font-size:13px;float:left;width:100%;border-bottom:1px solid #ddd;padding:5px 10px 5px 10px;\">\n\n                \n\n"
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"type") : depth0),"contact_data",{"name":"ifCond","hash":{},"fn":container.program(6, data, 0),"inverse":container.program(8, data, 0),"data":data,"loc":{"start":{"line":55,"column":24},"end":{"line":74,"column":35}}})) != null ? stack1 : "")
    + "\n               \n\n                <div class=\"KLM_extensionSingleProfileViewWrapperBlockSingleRowData\" style=\"float:left;\">\n\n"
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"type") : depth0),"contact_data",{"name":"ifCond","hash":{},"fn":container.program(17, data, 0),"inverse":container.program(19, data, 0),"data":data,"loc":{"start":{"line":80,"column":20},"end":{"line":132,"column":31}}})) != null ? stack1 : "")
    + "\n                        \n\n                </div>\n\n            </div>    \n\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "background-color: #eee;";
},"6":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n                                <div class=\"KLM_extensionSingleProfileViewWrapperBlockSingleRowIcon\" style=\"margin: 2px 15px 5px 0px;float:left;width:20px;height:20px;\">\n\n                                    <span style=\"padding: 3px 10px 5px 5px;font-size:10px;float:left;\">\n                                        <img width=\"20\" height=\"20\" src=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"value","hash":{},"data":data,"loc":{"start":{"line":60,"column":73},"end":{"line":60,"column":82}}}) : helper)))
    + "\">\n                                    </span>\n\n                                </div>\n\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n\n                                <div class=\"KLM_extensionSingleProfileViewWrapperBlockSingleRowIcon\" style=\"margin: 0px 15px 0px 5px;float:left;"
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"type") : depth0),"head",{"name":"ifCond","hash":{},"fn":container.program(9, data, 0),"inverse":container.program(11, data, 0),"data":data,"loc":{"start":{"line":68,"column":144},"end":{"line":68,"column":267}}})) != null ? stack1 : "")
    + "\">\n\n                                    <img style=\"float:left;width:100%; "
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"type") : depth0),"head",{"name":"ifCond","hash":{},"fn":container.program(13, data, 0),"inverse":container.program(15, data, 0),"data":data,"loc":{"start":{"line":70,"column":71},"end":{"line":70,"column":195}}})) != null ? stack1 : "")
    + "\" src=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"picture") || (depth0 != null ? lookupProperty(depth0,"picture") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"picture","hash":{},"data":data,"loc":{"start":{"line":70,"column":202},"end":{"line":70,"column":213}}}) : helper)))
    + "\">\n\n                                </div>\n\n";
},"9":function(container,depth0,helpers,partials,data) {
    return "border-radius:50px;width:40px;height:40px;";
},"11":function(container,depth0,helpers,partials,data) {
    return "width:20px;height:20px;padding-top:7px;";
},"13":function(container,depth0,helpers,partials,data) {
    return "border-radius:50px;width:40px;height:40px;margin-left:-5px;";
},"15":function(container,depth0,helpers,partials,data) {
    return "width:20px;height:20px;";
},"17":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n                        <div style=\"float: left;margin: 5px 0px 0px 10px;\" class=\"KLM_extensionSingleProfileViewWrapperBlockSingleRowDataContent KLM_extensionSingleProfileViewWrapperBlockSingleRowDataContentContactData_"
    + alias4(((helper = (helper = lookupProperty(helpers,"row") || (depth0 != null ? lookupProperty(depth0,"row") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"row","hash":{},"data":data,"loc":{"start":{"line":82,"column":219},"end":{"line":82,"column":226}}}) : helper)))
    + "\">\n\n                            "
    + alias4(((helper = (helper = lookupProperty(helpers,"value_second") || (depth0 != null ? lookupProperty(depth0,"value_second") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value_second","hash":{},"data":data,"loc":{"start":{"line":84,"column":28},"end":{"line":84,"column":44}}}) : helper)))
    + "\n\n                        </div>\n\n";
},"19":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n"
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"type") : depth0),"head",{"name":"ifCond","hash":{},"fn":container.program(20, data, 0),"inverse":container.program(22, data, 0),"data":data,"loc":{"start":{"line":90,"column":24},"end":{"line":130,"column":35}}})) != null ? stack1 : "")
    + "\n";
},"20":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n                            <div class=\"KLM_extensionSingleProfileViewWrapperBlockSingleRowDataTitle\" style=\"margin:8px 0px 0px 0px;font-size:15px;font-weight:bold;width:200px;\">\n\n                                    "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"value","hash":{},"data":data,"loc":{"start":{"line":94,"column":36},"end":{"line":94,"column":45}}}) : helper)))
    + "\n\n                            </div>\n\n";
},"22":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n                            <div class=\"KLM_extensionSingleProfileViewWrapperBlockSingleRowDataTitle\" style=\"width:215px;font-weight:bold;\">\n\n                                    "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":102,"column":36},"end":{"line":102,"column":45}}}) : helper)))
    + "\n\n                            </div>\n\n                            <div class=\"KLM_extensionSingleProfileViewWrapperBlockSingleRowDataContent\" style=\"float:left;width:220px;min-height:20px;"
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"is_empty") : depth0),"true",{"name":"ifCond","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":106,"column":150},"end":{"line":106,"column":200}}})) != null ? stack1 : "")
    + "\">\n\n"
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"is_empty") : depth0),"true",{"name":"ifCond","hash":{},"fn":container.program(25, data, 0),"inverse":container.program(27, data, 0),"data":data,"loc":{"start":{"line":108,"column":36},"end":{"line":124,"column":47}}})) != null ? stack1 : "")
    + "\n                                    \n\n                            </div>\n\n";
},"23":function(container,depth0,helpers,partials,data) {
    return "opacity:0.3;";
},"25":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n                                        "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"value","hash":{},"data":data,"loc":{"start":{"line":110,"column":40},"end":{"line":110,"column":49}}}) : helper)))
    + "\n                                    \n";
},"27":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n"
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"has_link") : depth0),"true",{"name":"ifCond","hash":{},"fn":container.program(28, data, 0),"inverse":container.program(30, data, 0),"data":data,"loc":{"start":{"line":114,"column":40},"end":{"line":122,"column":51}}})) != null ? stack1 : "")
    + "\n";
},"28":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n                                            <a href=\"http://"
    + alias4(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data,"loc":{"start":{"line":116,"column":60},"end":{"line":116,"column":69}}}) : helper)))
    + "\" target=\"_blank\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data,"loc":{"start":{"line":116,"column":87},"end":{"line":116,"column":96}}}) : helper)))
    + "</a>\n                                        \n";
},"30":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n                                            "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"value","hash":{},"data":data,"loc":{"start":{"line":120,"column":44},"end":{"line":120,"column":53}}}) : helper)))
    + "\n\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n\n<div class=\"KLM_extensionSingleProfileViewWrapperBlock\" style=\"padding-bottom:100px;box-sizing: border-box;float:left;width:100%;\">\n\n        \n\n        <div class=\"\" style=\"float:left;width:100%;font-size:13px;padding:0px 0px 0px 0px;border-bottom:1px solid #ddd;\">\n\n           \n            \n            \n            \n            <button class=\"KLM__button__view\" id=\"KLMUnlockProfileInformation\" style=\""
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"has_unlocked") : depth0),"true",{"name":"ifCond","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":13,"column":86},"end":{"line":13,"column":141}}})) != null ? stack1 : "")
    + "margin-top:0px;min-height:40px;background-color:"
    + alias4(((helper = (helper = lookupProperty(helpers,"companyColor") || (depth0 != null ? lookupProperty(depth0,"companyColor") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"companyColor","hash":{},"data":data,"loc":{"start":{"line":13,"column":189},"end":{"line":13,"column":205}}}) : helper)))
    + "!important;\"><img src=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"iconUnlock") || (depth0 != null ? lookupProperty(depth0,"iconUnlock") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"iconUnlock","hash":{},"data":data,"loc":{"start":{"line":13,"column":228},"end":{"line":13,"column":242}}}) : helper)))
    + "\" style=\"margin: 0px 10px -4px 0px;width:15px;height:15px;\"> "
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"translate_minibar") : depth0)) != null ? lookupProperty(stack1,"text_210") : stack1), depth0))
    + "</button>\n\n            \n\n            <div class=\"bindKLMLoaderSaveProfile\" style=\"float:left;width:100%;text-align:center;display:none;\">\n                <div class=\" bind383738338383\" style=\"\"></div>\n            </div>\n           \n            <div class=\"KLMUnlockLoaderWrapper\" style=\"display:none;text-align:center;\">\n                <div class=\"bind383738338383 KLMUnlockLoader\" style=\"\"></div>\n                <br>\n                "
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"translate_minibar") : depth0)) != null ? lookupProperty(stack1,"text_213") : stack1), depth0))
    + "\n            </div>\n            <a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"companyUpgradeLink") || (depth0 != null ? lookupProperty(depth0,"companyUpgradeLink") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"companyUpgradeLink","hash":{},"data":data,"loc":{"start":{"line":26,"column":21},"end":{"line":26,"column":43}}}) : helper)))
    + "\" class=\"KLMWarningNoCreditsUnlockProfileInformation\" target=\"_blank\" style=\"display:none;\">\n                <div class=\"\" style=\"color:#fff;background-color: #d61b1e !important;\nborder-color: #c40e1d !important;\n-webkit-box-sizing: border-box;\n-moz-box-sizing: border-box;\nbox-sizing: border-box;\nmargin: 5px 0px 5px 0px;    padding: 4px 10px 4px 10px;float:left;width:100%;\">\n                    "
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"translate_minibar") : depth0)) != null ? lookupProperty(stack1,"text_214") : stack1), depth0))
    + "\n                </div>  \n            </a>\n                <div class=\"KLMWarningNoDataUnlockProfileInformation\" style=\"display:none;color:#fff;background-color: #df982f !important;\nborder-color: #df982f !important;\n-webkit-box-sizing: border-box;\n-moz-box-sizing: border-box;\nbox-sizing: border-box;\nmargin: 5px 0px 5px 0px;    padding: 4px 10px 4px 10px;float:left;width:100%;\">\n"
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"translate_minibar") : depth0)) != null ? lookupProperty(stack1,"text_215") : stack1), depth0))
    + "\n                </div>  \n            \n        </div>\n\n        \n\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"profile") : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":49,"column":8},"end":{"line":140,"column":17}}})) != null ? stack1 : "")
    + "\n        \n\n</div>\n";
},"useData":true});
})();