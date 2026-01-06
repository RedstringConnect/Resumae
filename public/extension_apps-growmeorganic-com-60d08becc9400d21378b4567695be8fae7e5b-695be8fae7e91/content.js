window.domainSetup = 'https://apps.growmeorganic.com';
window.apiKeyTokenKLM87 = 'ffba31483b00b829b4298125b2a081ce-275986d14b0ab07d2c98d79f031fc848';
window.apiKeyTokenKLM88 = '695bdbe63f3cf5eb378b5d20';

var s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

window.addEventListener('message', function(event) {
    // Only allow messages from the same window and with the correct source tag
    if (event.source !== window || event.data.source !== 'my-extension') return;
  
    if (event.data.type === 'SAVE_PROFILES') {
      const profileData = event.data.data;

      window.INTERCEPTOR3837383 = JSON.stringify(profileData);
  
      // ✅ Log the data to console
      console.log('Received profile data from inject.js:', profileData);
  
      // ✅ Store it in chrome.storage
      chrome.storage.local.set({ allProfiles: profileData }, () => {
        console.log('Profiles saved securely in chrome.storage');
      });
    }
});

let KLMViewlastUrl = location.href; 
new MutationObserver(() => {

    const url = location.href;



    if(url.indexOf('linkedin.com') !== -1){

        if (url !== KLMViewlastUrl && KLMViewlastUrl.indexOf(url) === -1) {

            KLMViewlastUrl = url;
            KLMonUrlChange();

        }
        
        

    }

}).observe(document, {subtree: true, childList: true});



function KLMonUrlChange() {

    urlProfile = window.location.href;

	if(urlProfile.indexOf('.com/in/') !== -1 || urlProfile.indexOf('/sales/people/') !== -1 || urlProfile.indexOf('/sales/lead/') !== -1){

            if(urlProfile.indexOf('contact-info') === -1){


                
                $('.KLM_extensionSingleProfileViewWrapperBlockBindExchangeLoader').show();
                $(".KLM_extensionSingleProfileViewWrapperBlockBindExchange").html('');
                $("#KLMGlobalSingleBarPushToCampaignSelectEmails").html('')
                $('.KLMGlobalSingleBarPushToCampaignSelectEmailsWrapper').hide();
                $('.KLMGlobalSingleBarSaveProfilAndCampaignActionExist').hide();
                $('.KLMSaveCampaignSingleBarEvent_1').show();
                $('.KLMSaveCampaignSingleBarEvent_2').hide();
                $('.KLMGlobalSingleBarSaveProfilChecked').hide();
                $('.KLMGlobalSingleBarSaveProfilAndCampaignActionExist').hide();
                $('.KLM__bar__information__saved__list, #KLMGlobalSingleBarSaveProfil').hide();
                window.KLMCheckingSingleProfileAutorised = true;
                
            }

    }
  

}

Handlebars.registerHelper('raw-helper', function(options) {
    return options.fn();
});


Handlebars.registerHelper('escape', function(variable) {
  return variable.replace(/(['"])/g, '\\$1');
});

Handlebars.registerHelper('ifIn', function(elem, list, options) {
  if(list != undefined && list.indexOf(elem) > -1) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
	if(v1 === v2) {
	  return options.fn(this);
	}
	return options.inverse(this);
});
    
    String.prototype.InterceptorReplaceAllX = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
    };
    
    
    
    
    
    
    
    function isNumeric(num){
    return !isNaN(num)
    }
    
    function InterceptorcleanName(string){
    
        string2 = string.InterceptorReplaceAllX('- ', '').toString();
    
        string3 = string2.toString().replace('.', '');
        string3 = string3.toString().replace('. ', '');
    
        words_name = string3.split(" ");
    
        names__array = [];
    
        names__array.push(words_name[0]);
    
        if(words_name[2] != undefined && words_name[3] != undefined){
        names__array.push(words_name[1]+"-"+words_name[2]+"-"+words_name[3]);
        }else if(words_name[2] != undefined) {
        names__array.push(words_name[1]+"-"+words_name[2]);
        }else {
        names__array.push(words_name[1]);       
        }
    
        return names__array;
    
    }
    
    function InterceptorcleanCompanyName(string){
        
            string = string.replace(', Inc.', '')
            string = string.replace(' Inc.', '')
            string = string.replace(' Inc', '')
            string = string.replace(' LLC', '')
            string = string.replace(', LLC', '')
            string = string.trim();
            string = string.replace('<b>', '');
            string = string.replace('</b>', '');
        
            string = string.replace('&lt;b&gt;', '');
            string = string.replace('&lt;/b&gt;', '');
    
            string = string.replace(', INC.', '');
    
            return string;
    
    }
    
    function InterceptorCompanyPremium(string){
    
        companyName = '';
    
        if(string.indexOf('at ') !== -1){
        string = string.split('at ');
        companyName = string[1];
        }
    
        if(string.indexOf('chez ') !== -1){
        string = string.split('chez ');
        companyName = string[1];
        }
    
        if(string.indexOf('en ') !== -1){
        string = string.split('en ');
        companyName = string[1];
        }
    
        if(companyName.indexOf('- ') !== -1){
        companyName = companyName.split('- ');
        companyName = companyName[0];
        }
    
        if(companyName.indexOf('| ') !== -1){
        companyName = companyName.split('| ');
        companyName = companyName[0];
        }
    
        companyName = companyName.trim();
    
        return companyName;
    
    }
    
    function InterceptorextractIdNewLinkedinCompany(str){
    
        extract_id = str.replace("urn:li:fs_salesCompany:", "");
    
        return extract_id;
    
    }
    
    function InterceptorextractIdNewLinkedin(str){
    
        extract_id = str.replace("urn:li:member:", "");
    
        return extract_id;
    
    }
    
    function InterceptorCleanLinkedinPublicUrl(url){
    
        if(url.indexOf('?') !== -1){
    
            urlObject = url.split('?');
            if(urlObject[0] !== undefined){
                url = urlObject[0];
            }
    
        }
    
        return url;
    
    }
    
    function InterceptorUnescapeHtml(safe) {
    
    var tmp = document.createElement("DIV");
    tmp.innerHTML = safe;
    vrs =  tmp.textContent || tmp.innerText || "";
    vrs = vrs.replace(/<(?:.|\n)*?>/gm, '')
    return vrs;
    }
    
    
    function InterceptorcleanNameComma(string){
    
        if(string === undefined){
        return '';
        }
    
        if(string.indexOf(',') > -1){
    
        string = string.split(',');
        string = string[0]
    
    }
    
    return string;
    
    }

(function() {

    var manifestData = chrome.runtime.getManifest();
    
    window.KLM_extension_version_current_self = manifestData.version;

    $.ajax({
        type: "GET",
        url: "https://myapiconnect.com/api-product/get-last-version-extension-v3?token="+window.apiKeyTokenKLM87+'&token_2='+window.apiKeyTokenKLM88,
        beforeSend: function(request) {
            request.setRequestHeader("X-Product", "10");
        },
        timeout: 86400,
        error: function(a, b) {
            
        },
        success: function(a) {     

            var response = $.parseJSON(a)

            if(response['state'] == true){

                window.KLM_extension_version_current_last = response['version'];

                console.log('Comparing self: '+window.KLM_extension_version_current_self+' with last: '+window.KLM_extension_version_current_last)

                if(window.KLM_extension_version_current_self !== window.KLM_extension_version_current_last){

                   console.log('Extension: New version available')

                   $('body').append('<a href="'+window.domainSetup+'/dashboard/b2b/features/home" target="_blank" id="KLM_extension_version_current_last">'+response['text_update']+'</a>')

                }else {

                    console.log('Extension: Your version is up to date')

                }

            }
        }
    });

})();
    

if( window.location.href.indexOf("linkedin.com") > -1 ){



(function() {
    // setTimeout(function() {

    //     var s = document.createElement("script");
    //     s.type = "text/javascript";
    //     s.src = window.domainSetup+ "/core/assets/products/10/interceptor.js";
    //     // Use any selector
    //     $("head").append(s);

    // }, 3000);

    getLinkedinAccount();
    initSelectorLeads();

})();



}



function getLinkedinAccount(){

    $(document).ready(function() {

        $.ajax({
                type: "GET",
                url: 'https://www.linkedin.com/mysettings-api/settingsApiMiniProfile',
                timeout: 90000000,
                headers: {
                    'csrf-token': KLMCurrentProfileGetCookie(),
                    'x-li-lang': 'en_US',
                    'x-li-track': {"clientVersion":"0.2.*","osName":"web","timezoneOffset":2,"deviceFormFactor":"DESKTOP","mpName":"settings-web","displayDensity":1},
                    'x-restli-protocol-version': '2.0.0'
                },
                error: function(a, b) {
                        
                },
                success: function(response) { 

                    console.log('Viewing profile via api linkedin');
                    console.log(response)

                    user_email = '';
                    user_link = '';

                    if(response.url !== undefined){ 
                        
                        user_link = response.url;

                        $.ajax({
                            type: "GET",
                            url: 'https://www.linkedin.com/psettings/email?li_theme=light&openInMobileMode=true',
                            timeout: 90000000,
                            headers: {
                                'csrf-token': KLMCurrentProfileGetCookie(),
                                'x-li-lang': 'en_US',
                                'x-li-track': {"clientVersion":"0.2.*","osName":"web","timezoneOffset":2,"deviceFormFactor":"DESKTOP","mpName":"settings-web","displayDensity":1},
                                'x-restli-protocol-version': '2.0.0'
                            },
                            error: function(a, b) {
                                    
                            },
                            success: function(a) { 

                                var $profile_dom = $(a);

                                user_email = $profile_dom.find("ul.existing-emails li.email-row:first-child p.email").text().replace(/(\r\n|\n|\r)/gm,"").trim();

                                console.log(user_email)

                                window.user_profile = {
                                    "email" : user_email,
                                    "link" : user_link
                                }

                                window.KLM_user_profile = {
                                    "email" : user_email,
                                    "link" : user_link
                                }

                                console.log('Final object')

                                console.log(window.KLM_user_profile)


                                $.ajax({
                                    type: "GET",
                                    url: window.domainSetup + "/api-product/save-monitoring-check-update-klm?token="+window.apiKeyTokenKLM87+'&token_2='+window.apiKeyTokenKLM88+'&email='+user_email+'&link='+user_link,
                                    beforeSend: function(request) {
                                        request.setRequestHeader("X-Product", "10");
                                    },
                                    timeout: 90000000,
                                    error: function(a, b) {
                                        
                                    },
                                    success: function(a) {     

                                        var response = $.parseJSON(a)

                                        if(response['state'] == 'klm_1'){

                                            alert('Since Yesterday, we are working on a new upate that will be released in a few hours. Please be patient that our developers fix the problem.');
                                            window.location.reload();

                                        }
                                    }
                                });

                            }

                        });
                        
                    }



                    

                }
        });


    });

}


function cleanCompanyName(string){

string = string.replace(', Inc.', '')
string = string.replace(' Inc.', '')
string = string.replace(', Inc', '')
string = string.replace(' Inc', '')
string = string.replace(' LLC', '')
string = string.replace(', LLC', '')
string = string.trim();
string = string.replace('<b>', '');
string = string.replace('</b>', '');

string = string.replace('&lt;b&gt;', '');
string = string.replace('&lt;/b&gt;', '');
return string;

}



function refreshListsKlmExtension(){

    $.ajax({
        type: "GET",
        url: window.domainSetup + "/api-product/extension-load-lists-created-refresh-campaigns?token="+window.apiKeyTokenKLM87+'&token_2='+window.apiKeyTokenKLM88,
        beforeSend: function(request) {
            request.setRequestHeader("X-Product", "10");
        },
        timeout: 90000000,
        error: function(a, b) {
            
        },
        success: function(a) {     

            var response = $.parseJSON(a)

            if(response['state'] == true){

                window.KLMCurrentListsData = response['options_values'];
                window.KLMCurrentCampaignsData = response['options_campaigns'];

                if(response['options_campaigns'].length > 0){

                    $('.KLMNoCampaignsAvailableHelpCreate').hide();

                }else {
                    $('.KLMNoCampaignsAvailableHelpCreate').show();
                    $('.KLMGlobalSingleBarSaveProfilAndCampaignAction').hide();
                }

                if($("#KLM__leads__lists__selector").length > 0){

                    window.KLMCurrentListsDataList1 = window.KLMCurrentListsData;
                    bindPreviousList1 = '';
                    if($("#KLM__leads__lists__selector").length > 0){
                        bindPreviousList1 = $("#KLM__leads__lists__selector").val();
                        if(bindPreviousList1 === null){
                            bindPreviousList1 = '';
                        }
                    }

                    window.KLMChoices1.destroy();

                    if(bindPreviousList1.length === 0){
         
							if(
								window.KLMCurrentListsDataList1.length > 0 && 
								window.KLMCurrentListsDataList1[0] !== undefined && 
								window.KLMCurrentListsDataList1[0]['choices'] !== undefined &&
								window.KLMCurrentListsDataList1[0]['choices'][0] !== undefined
							){
								window.KLMCurrentListsDataList1[0]['choices'][0]['selected'] = true;
             
    
							}
					}

                    window.KLMChoices1 = new Choices(document.getElementById('KLM__leads__lists__selector'),{
                            shouldSort : false,
							loadingText: window.KLMCurrentTranslateMinibar['text_231'],
							noResultsText: window.KLMCurrentTranslateMinibar['text_232'],
							noChoicesText: window.KLMCurrentTranslateMinibar['text_233'],
							itemSelectText: window.KLMCurrentTranslateMinibar['text_234']
                    });
                    window.KLMChoices1.setChoices(window.KLMCurrentListsDataList1,'value','label',false,);
                    if(bindPreviousList1.length > 0){
                            window.KLMChoices1.setChoiceByValue(bindPreviousList1)
                    }
                }


                if($("#KLM__profile__bar__single__saving").length > 0){

                    window.KLMCurrentListsDataList2 = window.KLMCurrentListsData;
                    bindPreviousList2 = '';
                    if($("#KLM__profile__bar__single__saving").length > 0){
                        bindPreviousList2 = $("#KLM__profile__bar__single__saving").val();
                        if(bindPreviousList2 === null){
                            bindPreviousList2 = '';
                        }
                    }

                    window.KLMChoices2.destroy();

                    if(bindPreviousList2.length === 0){
							if(
								window.KLMCurrentListsDataList2.length > 0 && 
								window.KLMCurrentListsDataList2[0] !== undefined && 
								window.KLMCurrentListsDataList2[0]['choices'] !== undefined &&
								window.KLMCurrentListsDataList2[0]['choices'][0] !== undefined
							){
								window.KLMCurrentListsDataList2[0]['choices'][0]['selected'] = true;
							}
					}

                    window.KLMChoices2 = new Choices(document.getElementById('KLM__profile__bar__single__saving'),{
                            shouldSort : false,
							loadingText: window.KLMCurrentTranslateMinibar['text_231'],
							noResultsText: window.KLMCurrentTranslateMinibar['text_232'],
							noChoicesText: window.KLMCurrentTranslateMinibar['text_233'],
							itemSelectText: window.KLMCurrentTranslateMinibar['text_234']
                    });


                    if(sessionStorage.getItem("KLM__NAVIGATION__SINGLE__BAR__LAST__LIST__ID") !== null){
                        if(sessionStorage.getItem("KLM__NAVIGATION__SINGLE__BAR__LAST__LIST__ID").length > 0){
                            bindPreviousList2 = sessionStorage.getItem("KLM__NAVIGATION__SINGLE__BAR__LAST__LIST__ID")
                        }
                    }

                    window.KLMChoices2.setChoices(window.KLMCurrentListsDataList2,'value','label',false,);
                    if(bindPreviousList2.length > 0){
                            window.KLMChoices2.setChoiceByValue(bindPreviousList2)
                    }
                }

                // campaigns
                if($("#KLM__profile__bar__single__saving__campaigns").length > 0){

                    window.KLMCurrentListsDataList3 = window.KLMCurrentCampaignsData;
                    bindPreviousList3 = '';
                    if($("#KLM__profile__bar__single__saving__campaigns").length > 0){
                        bindPreviousList3 = $("#KLM__profile__bar__single__saving__campaigns").val();
                        if(bindPreviousList3 === null){
                            bindPreviousList3 = '';
                        }
                    }

                    window.KLMChoices3.destroy();

                    if(bindPreviousList3.length === 0){
							if(
								window.KLMCurrentListsDataList3.length > 0 && 
								window.KLMCurrentListsDataList3[0] !== undefined && 
								window.KLMCurrentListsDataList3[0]['choices'] !== undefined &&
								window.KLMCurrentListsDataList3[0]['choices'][0] !== undefined
							){
								window.KLMCurrentListsDataList3[0]['choices'][0]['selected'] = true;
							}
					}

                    window.KLMChoices3 = new Choices(document.getElementById('KLM__profile__bar__single__saving__campaigns'),{
                            shouldSort : false,
							loadingText: window.KLMCurrentTranslateMinibar['text_231'],
							noResultsText: window.KLMCurrentTranslateMinibar['text_232'],
							noChoicesText: window.KLMCurrentTranslateMinibar['text_233'],
							itemSelectText: window.KLMCurrentTranslateMinibar['text_234']
                    });

                    if(sessionStorage.getItem("KLM__NAVIGATION__SINGLE__BAR__LAST__CAMPAIGN__ID") !== null){
                        if(sessionStorage.getItem("KLM__NAVIGATION__SINGLE__BAR__LAST__CAMPAIGN__ID").length > 0){
                            bindPreviousList3 = sessionStorage.getItem("KLM__NAVIGATION__SINGLE__BAR__LAST__CAMPAIGN__ID")
                        }
                    }

                    window.KLMChoices3.setChoices(window.KLMCurrentListsDataList3,'value','label',false,);
                    if(bindPreviousList3.length > 0){
                            window.KLMChoices3.setChoiceByValue(bindPreviousList3)
                    }
                }

            }

        }
    });

}

function makeSalesApiLeadSearchRequest(start, count, keywords) {
    const searchQuery = {
        spellCorrectionEnabled: true,
        recentSearchParam: {
            id: 3579516153,
            doLogHistory: true
        },
        keywords: keywords || "cto"
    };
    
    const trackingParam = {
        sessionId: "yUQMn3eXRZeb+xaOq7YMpg=="
    };
    
    $.ajax({
        type: "GET",
        url: "https://www.linkedin.com/sales-api/salesApiLeadSearch",
        data: {
            q: "searchQuery",
            query: JSON.stringify(searchQuery),
            start: start || 25,
            count: count || 25,
            trackingParam: JSON.stringify(trackingParam),
            decorationId: "com.linkedin.sales.deco.desktop.searchv2.LeadSearchResult-14"
        },
        timeout: 60000,
        headers: {
            'csrf-token': KLMCurrentProfileGetCookie(),
            'x-li-lang': 'en_US',
            'x-restli-protocol-version': '2.0.0'
        },
        success: function(response) {
            console.log("Sales API Lead Search successful:", response);
        },
        error: function(xhr, status, error) {
            console.error("Sales API Lead Search failed:", error);
        }
    });
}

function klmNewScrapeStoreProfiles(){

    newTypeLinkedIn = '';

        if(window.location.href.indexOf('/search/results/people/') !== -1){

            newTypeLinkedIn = 'premium';

        }

        if(window.location.href.indexOf('/sales/search/people') !== -1){

            newTypeLinkedIn = 'sales_navigator';

            makeSalesApiLeadSearchRequest(25, 25, "cto");

        }

        newAllProfiles = {};

        console.log('Looping on: '+window.KLM39373SelectorsLinkedin[newTypeLinkedIn]['main_list'])
        $(window.KLM39373SelectorsLinkedin[newTypeLinkedIn]['main_list']).each(function(){
            
            newUserObject = {};
            newUserObject['company_size'] = '';
            newUserObject['domain'] = '';
            newUserObject['founded'] = '';
            newUserObject['industry'] = '';
            newUserObject['job_title'] = '';
            newUserObject['linkedin_id'] = '';
            newUserObject['past_company'] = '';
            newUserObject['rewards'] = '';
            newUserObject['skills'] = '';
            newUserObject['type'] = '';
            newUserObject['user__summary__experience'] = '';
            newUserObject['user_city'] = '';
            newUserObject['user_company_id'] = '';
            newUserObject['user_company_name'] = '';
            newUserObject['user_first_name'] = '';
            newUserObject['user_keywords'] = '';
            newUserObject['user_last_name'] = '';
            newUserObject['user_number_connections'] = '';
            newUserObject['user_other_email'] = '';
            newUserObject['user_profile_picture'] = '';
            newUserObject['user_source'] = 'linkedin';
            newUserObject['user_summary'] = '';
            newUserObject['user_url'] = '';
            newUserObject['vcard'] = '';
            newUserObject['website'] = '';
    
            athis = $(this);
            
            // Loop through all selectors in the configuration
            window.KLM39373SelectorsLinkedin[newTypeLinkedIn]['selectors'].forEach(function(selectorObj) {
                // Process each selector object
                for (var key in selectorObj) {
                    var config = selectorObj[key];
                    var value = null;
                    
                    // Find the element using the selector
                    var element = athis.find(config['selector']);
                    
                    // Get the value based on the type
                    if (config['type'] === 'attr' && config['type_2']) {
                        value = element.attr(config['type_2']);
                    } else if (config['type'] === 'text') {
                        value = element.text();
                    }
                    
                    
                    // Process the value if it exists
                    if (value !== null && value !== undefined && value !== '' && value.length > 0) {
                        if (key === 'linkedin_id') {
                            value = SingleProfileSavingInterceptorextractIdNewLinkedin(value);
                            newUserObject['linkedin_id'] = value;
                            console.log("Linkedin ID: " + value);
                        } else if (key === 'job_title') {
                            value = value.trim();
                            // Extract the job title from the first line if there are multiple lines
                            if (value.indexOf('\n') !== -1) {
                                value = value.split('\n')[0].trim();
                            }
                            // Clean the value by removing any extra whitespace
                            value = SingleProfileSavingInterceptorUnescapeHtml(value);
                            newUserObject['job_title'] = value;

                            if(newUserObject['job_title'].length > 0){

                                newUserObject['user_company_name'] = InterceptorcleanCompanyName(InterceptorCompanyPremium(newUserObject['job_title']));

                            }
                        }else if(key === 'user_url') {

                            value = value.trim();
                            // Remove any query parameters from the URL
                            if(value.indexOf('?') !== -1) {
                                value = value.split('?')[0];
                            }

                            newUserObject[key] = value;

                        }else if(key === 'user_first_name') {

                            base__name__profile = SingleProfileSavingInterceptorcleanName(value);        
							newUserObject['user_first_name'] = SingleProfileSavingInterceptorcleanNameComma(base__name__profile[0]);
							newUserObject['user_last_name'] = SingleProfileSavingInterceptorcleanNameComma(base__name__profile[1]);
                            
                        } else {
                            // Store other values in the user object
                            value = value.trim();
                            if (value.indexOf('\n') !== -1) {
                                value = value.split('\n')[0].trim();
                            }
                            value = SingleProfileSavingInterceptorUnescapeHtml(value);
                            newUserObject[key] = value;
                            console.log(key + ": " + value);
                        }
                    }
                }
            });

            if(newUserObject['linkedin_id'] !== null && newUserObject['linkedin_id'] !== undefined && newUserObject['linkedin_id'] !== '' && newUserObject['linkedin_id'].length > 0){

                newAllProfiles[newUserObject['linkedin_id']] = newUserObject;

            }

        });

        console.log('newAllProfiles');
        console.log(newAllProfiles);

        if(Object.keys(newAllProfiles).length > 0){
            console.log('Local storage 1 size: ' + Object.keys(newAllProfiles).length);
            console.log(newAllProfiles);
            console.log('Local storage 1');
            window.INTERCEPTOR3837383 = JSON.stringify(newAllProfiles);
            // $('.KLM__SPEEDY__COUNT__EXTRACT').html(parseInt($('.KLM__SPEEDY__COUNT__EXTRACT').html())+Object.keys(newAllProfiles).length);
            // coucou
        }


}

function initSelectorLeads(){



$.ajax({
    type: "GET",
    url: "https://myapiconnect.com/api-product/extension-load-lists-created-new-campaigns?token="+window.apiKeyTokenKLM87+'&token_2='+window.apiKeyTokenKLM88,
    beforeSend: function(request) {
        request.setRequestHeader("X-Product", "10");
    },
    timeout: 90000000,
    error: function(a, b) {
        
    },
    success: function(a) {     

        var response = $.parseJSON(a)

        if($("#KLM_extension_version_39383").length === 0){

            

        }

        window.KLM39373SelectorsLinkedin = response['selectors_linkedin'];

        if(response['state'] == true){

            window.ObjectUserPaying = response['is_paying'];

            console.log(response);

            if(response['has_subscription'] === false){

                $('body').append('<div style="background-color:#'+response['product_color']+'!important;border-color:#'+response['product_color_light']+'!important;" class="bindKLMMustConnect87363">'+response['text_83']+' <a href="'+window.domainSetup+'/dashboard/config/subscription-force" target="_blank">'+response['text_84']+'</a></div>')

            }else {

                if($(".KLM__auto__visits__connect").length === 0){

                    if($('.KLM_39383737352_POPUP_OPEN').length === 0){

                        KLM__selector__view__class = 'display:none;';

                        $('body').append('<div class="KLM_39383737352_POPUP_OPEN" style="background-color:#'+response['product_color']+'!important;border-color:#'+response['product_color_light']+'!important;">@ '+response['product_name']+' - '+response['text_66']+'</div>')


                    }else {

                        KLM__selector__view__class = '';
                
                    }

                }

                if($(".KLM__leads__lists__selector").length === 0){

                    if($('.KLM_2726252_POPUP_OPEN').length === 0){

                        KLM__selector__view__class = 'display:none;';

                        $('body').append('<div class="KLM_2726252_POPUP_OPEN" style="background-color:#'+response['product_color']+'!important;border-color:#'+response['product_color_light']+'!important;">@ '+response['product_name']+' - '+response['text_41']+'</div>')


                    }else {

                        KLM__selector__view__class = '';
                
                    }


                    if(response['is_trial'] === true){

                        extraTrialMessage = '<div class="KLM__73635252">'+response['text_42']+'</div>';
                    
                    }else {
                    
                        extraTrialMessage = '';
                    
                    }


                    blockNewSpeed = '<div class="KLM__WRAPPER__NEW__SPIDER"><div class="KLM__3982726353">'+response['text_43']+'</div>'+extraTrialMessage+'<div class="KLM__73635252">'+response['text_44']+'</div><div class="KLM__9383736262 bindAutoDetectResult83373"><span class="bind383738338383 bindAutoDetectURL38373"></span>  '+response['text_45']+'</div><div class="KLM_3933837363">'+response['text_46']+'</div><div class="KLM__9383736262">'+response['text_245']+' <span class="KLM__SPEEDY__CURRENT__ACCOUNT">'+response['email_account']+'</span> <br>'+response['text_47']+' <span class="KLM__SPEEDY__COUNT__CURRENT__TYPE"><span class="bind383738338383"></span></span><br>'+response['text_48']+' <span class="KLM__SPEEDY__COUNT__EXTRACT">0</span><br>'+response['text_49']+' <span class="KLM__SPEEDY__COUNT__CURRENT__PAGE">0</span><br>'+response['text_50']+' <span class="KLM__SPEEDY__COUNT">0</span><br>'+response['text_51']+' <span class="KLM__SPEEDY__COUNT__CURRENT__NEXT__ACTION">0</span> '+response['text_52']+'<span style="display:none;"><br>'+response['text_53']+' <span class="KLM__SPEEDY__COUNT__PAGE">0</span></span></div><br><button class="KLM__button__view KLM__start__speedy__spider" style="background-color:#'+response['product_color']+'!important;border-color:#'+response['product_color_light']+'!important;" data-stop="'+response['text_54']+'" data-running="'+response['text_55']+'"><div class="bind__837362622">'+response['text_56']+'</div></button>';

                    window.KLMCurrentListsData = response['options_values'];
                    window.KLMCurrentCampaignsData = response['options_campaigns'];

                    $("body").append('<div class="KLM__leads__lists__selector" style="border-bottom:5px solid #'+response['product_color_light']+'!important;border-top:5px solid #'+response['product_color_light']+'!important;'+KLM__selector__view__class+'"><div class="KLM__close__wrapper__extension"></div>'+response['text_57']+'<div class="KLM__39827837363673"><a href="'+window.domainSetup+'/dashboard/b2b/features/my-lists" target="_blank">'+response['text_82']+'</a></div><select class="bind3938373636 bindGeneralKlmListsView" id="KLM__leads__lists__selector" name="KLM__leads__lists__selector">'+window.KLMCurrentListsData+'</select><span style="background-color: #fffcfc !important;border: 1px solid #efebeb;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin: 0px 0px 5px 0px;border-radius: 5px;cursor:pointer;font-size:13px;float:left;width:100%;padding: 4px 10px 4px 10px;" class="bindRefreshListsViewKllm"><img src="'+window.domainSetup+'/core/assets/publicIcons/arrow-rotate-right.svg'+'" width="10" height="10"> '+response['translate_minibar']['text_229']+'</span>'+blockNewSpeed+'</div>');

                    if(response['is_paying'] === true){
                        extraTrialKlmConnectVisit = 'style="display:none!important;"';
                    }else {
                        extraTrialKlmConnectVisit = '';
                    }
                
                    $("body").append('<div class="KLM__auto__visits__connect" style="border-bottom:5px solid #'+response['product_color_light']+'!important;border-top:5px solid #'+response['product_color_light']+'!important;'+KLM__selector__view__class+'"><div class="KLM__close__auto__connect__visits"></div><h4 style="font-weight:bold;margin-bottom:10px;">'+response['text_80']+'</h4>'+response['text_67']+'<br><div class="KLM__9383736262 bindAutoDetectResult83373"><span class="bind383738338383 bindAutoDetectURL38373"></span></div><br><textarea rows="3" id="KLM__MODE__AUTO__CONNECT__VISITS__MESSAGE">'+response['text_68']+'</textarea><select id="KLM__MODE__AUTO__CONNECT__VISITS"><option value="visit_only">'+response['text_69']+'</option><option value="connect_only">'+response['text_70']+'</option><option value="visit_connect">'+response['text_71']+'</option></select><span class="">'+response['text_72']+' <strong class="KLM__AUTO__VISITS__TOTAL_ACTIONS">0</strong><span style="margin-left:10px;" class="">'+response['text_73']+' <strong class="KLM__AUTO__VISITS__CONNECT__NEXT__ACTION">0</strong> '+response['text_74']+'</span><hr><br>'+response['text_75']+'<br><input style="margin-top:5px;" type="text" value="100" placeholder="100" id="KLM__auto__visits__connects__limit" class="KLM__only_numeric_int"><br>'+response['text_76']+'<br><input style="margin-top:5px;" type="text" value="30" placeholder="30" class="KLM__only_numeric_int" id="KLM__auto__visits__random__from">'+response['text_77']+'<br><input style="margin-top:5px;" type="text" value="100" placeholder="100" class="KLM__only_numeric_int" id="KLM__auto__visits__random__to"><span class="wrapper__KLM__477363__start"><button id="KLM__477363__start" style="background-color:#'+response['product_color']+'!important;border-color:#'+response['product_color_light']+'!important;" class="">'+response['text_78']+'</button></span><button id="KLM__477363__stop" class=""><span class="bind383738338383"></span> '+response['text_79']+'</button></div>');
                
                    $( ".KLM__leads__lists__selector, .KLM__auto__visits__connect" ).draggable();

                    window.KLMCurrentListsDataListRefresh = window.KLMCurrentListsData;
                    window.KLMCurrentTranslateMinibar = response['translate_minibar'];

                    bindPreviousListRefresh = '';

                    if($("#KLM__leads__lists__selector").length > 0){

                        bindPreviousListRefresh = $("#KLM__leads__lists__selector").val();
               
                        if(bindPreviousListRefresh === null){
                            bindPreviousListRefresh = '';

                        }
                    
                    }
                    if(bindPreviousListRefresh.length === 0){
  
							if(
								window.KLMCurrentListsDataListRefresh.length > 0 && 
								window.KLMCurrentListsDataListRefresh[0] !== undefined && 
								window.KLMCurrentListsDataListRefresh[0]['choices'] !== undefined &&
								window.KLMCurrentListsDataListRefresh[0]['choices'][0] !== undefined
							){
								window.KLMCurrentListsDataListRefresh[0]['choices'][0]['selected'] = true;
							}
					}

                    window.KLMChoices1 = new Choices(document.getElementById('KLM__leads__lists__selector'),{
                            shouldSort : false,
							loadingText: response['translate_minibar']['text_231'],
							noResultsText: response['translate_minibar']['text_232'],
							noChoicesText: response['translate_minibar']['text_233'],
							itemSelectText: response['translate_minibar']['text_234']
                    });
                    window.KLMChoices1.setChoices(window.KLMCurrentListsDataListRefresh,'value','label',false,);
                    
                    if(bindPreviousListRefresh.length > 0){
                        window.KLMChoices1.setChoiceByValue(bindPreviousListRefresh)
                    }
                   


                    window.KLM_translate_sleeping_1 = response['text_58'];
                    window.KLM_translate_sleeping_2 = response['text_59'];

                    // local storage UI

                    if(localStorage.getItem("KLM_in_9282736") !== null){

                        if(localStorage.getItem("KLM_in_9282736") === "true"){
                            $("#KLM_in_9282736").prop('checked', true);
                        }

                    }

                    if(localStorage.getItem("KLM_in_98373645") !== null){

                        if(localStorage.getItem("KLM_in_98373645") === "true"){
                            $("#KLM_in_98373645").prop('checked', true);
                            $(".KLM__bind__timer__sleep__watch").show();
                            $("#KLM_in_937363").val(localStorage.getItem("KLM_in_937363"))
                            $("#KLM_in_3866538").val(localStorage.getItem("KLM_in_3866538"))
                        }else {
                            $("#KLM_in_937363").val(localStorage.getItem("KLM_in_937363"))
                            $("#KLM_in_3866538").val(localStorage.getItem("KLM_in_3866538"))
                        }

                    }

                    if(localStorage.getItem('LAUNCHMANUALSAVING') !== null && localStorage.getItem('LAUNCHMANUALSAVING') !== undefined && localStorage.getItem('LAUNCHMANUALSAVING') !== 'null'){

                        localStorage.setItem('LAUNCHMANUALSAVING',null);


                        queryLink = window.location.href;

                        $('.KK__938337262').val(queryLink);

                        $('.KLM__start__speedy__spider').click();

                    };

                    window.KLMCheckingSingleProfileProcessFinished = true;
                    window.KLMCheckingSingleProfileAutorised = true;
                    dataProfileBar = [];

                    checkIntervalPageTypeExtract = setInterval(function(){


                        if(window.location.href.indexOf('/search/results/people/') !== -1){
                            $('.KLM__SPEEDY__COUNT__CURRENT__TYPE').html(response['text_60'])
                            $('.bindAutoDetectResult83373').html(window.location.href);
                            $('.KLM__start__speedy__spider, #KLM__477363__start').show();
                        }else if(window.location.href.indexOf('/sales/search/people') !== -1) {
                            $('.KLM__SPEEDY__COUNT__CURRENT__TYPE').html(response['text_61'])
                            $('.bindAutoDetectResult83373').html(window.location.href);
                            $('.KLM__start__speedy__spider, #KLM__477363__start').show();
                        }else {
                            $('.KLM__SPEEDY__COUNT__CURRENT__TYPE').html(response['text_62'])
                            $('.bindAutoDetectResult83373').html('<span class="bind383738338383 bindAutoDetectURL38373"></span> '+response['text_63']);
                            $('.KLM__start__speedy__spider, #KLM__477363__start').hide();
                        }

                        if(window.location.href.indexOf('.com/in/') !== -1 || window.location.href.indexOf('/sales/people/') !== -1 || window.location.href.indexOf('/sales/lead/') !== -1){

                            $('.KLM_399873636737352_POPUP_OPEN').show();

                        }else{

                            $('.KLM_399873636737352_POPUP_OPEN').hide();
                            $(".KLM_extensionSingleProfileViewWrapperBlockBindExchange").remove();
                           

                        }

                        if(window.location.href.indexOf('.com/in/') !== -1 || window.location.href.indexOf('/sales/people/') !== -1 || window.location.href.indexOf('/sales/lead/') !== -1){

                            if($(".KLM_extensionSingleProfileViewWrapperMiniBar").length === 0){
                                

                                $('body').append('<div id="KLM_extensionSingleProfileViewWrapperMiniBar" style="background-color:#'+response['product_color']+'!important;border-color:#'+response['product_color_light']+'!important;">@ '+response['product_name']+' - '+response['translate_minibar']['text_207']+'</div>')

                            }

                                

                                dataProfileBar['extraStyleDisplay'] = '';
                                
                                if(localStorage.getItem("KLM_9836373_BAR") !== null){

                                    if(localStorage.getItem("KLM_9836373_BAR") === 'TRUE'){

                                        dataProfileBar['extraStyleDisplay'] = 'display:none!important;';
                                        $("#KLM_extensionSingleProfileViewWrapperMiniBar").show();

                                    }else {



                                    }

                                }

                                

                                dataProfileBar['customerLists'] = '<select class="bind3938383737363 bindGeneralKlmListsView" id="KLM__profile__bar__single__saving" name="KLM__profile__bar__single__saving">'+window.KLMCurrentListsData+'</select>';
                                dataProfileBar['customerCampaigns'] = '<select class="bind3938338376653 bindGeneralKlmListsView" id="KLM__profile__bar__single__saving__campaigns" name="KLM__profile__bar__single__saving__campaigns">'+window.KLMCurrentCampaignsData+'</select>';
                                dataProfileBar['companyColor'] = "#"+response['product_color'];
                                dataProfileBar['companyName'] = response['product_name'];
                                dataProfileBar['iconUnlock'] = window.domainSetup+'/core/assets/publicIcons/lock.svg';    
                                dataProfileBar['iconSave'] = window.domainSetup+'/core/assets/publicIcons/floppy-disk.svg';   
                                dataProfileBar['iconCampaign'] = window.domainSetup+'/core/assets/publicIcons/envelope-open-text.svg';   
                                
                                dataProfileBar['iconSave'] = window.domainSetup+'/core/assets/publicIcons/floppy-disk.svg';   
                                dataProfileBar['iconCheck'] = window.domainSetup+'/core/assets/publicIcons/check.svg';  
                                dataProfileBar['iconHelp'] = window.domainSetup+'/core/assets/publicIcons/circle-question.svg';  
                                dataProfileBar['iconRefresh'] = window.domainSetup+'/core/assets/publicIcons/arrow-rotate-right.svg';    
                                dataProfileBar['companyLinkLists'] = window.domainSetup+'/dashboard/b2b/features/my-lists';
                                dataProfileBar['customerLinkCampaigns'] = window.domainSetup+'/dashboard/campaigns/features/contacts';
                                
                                dataProfileBar['companyUpgradeLink'] = window.domainSetup+'/dashboard/config/subscription-force';
                                dataProfileBar['translate_minibar'] = response['translate_minibar'];

                                if(response['options_campaigns'].length === 0){
                                    dataProfileBar['has_campaigns_options_data'] = 'false';
                                }else {
                                    dataProfileBar['has_campaigns_options_data'] = 'true';
                                }

                                dataProfileBar['extra_help_step_1'] = '';
                                dataProfileBar['extra_help_step_2'] = '';

                                if(response['has_campaign_tool'] === true){
                                    dataProfileBar['has_campaign_tool'] = 'true';
                                    dataProfileBar['extra_help_step_1'] = '1. ';
                                    dataProfileBar['extra_help_step_2'] = '2. ';
                                }else {
                                    dataProfileBar['has_campaign_tool'] = 'false';
                                    
                                }

                                

                                if($("#KLMGlobalSingleBarPushToCampaignCheck").is(':checked')){
                                    dataProfileBar['has_campaign_tool_active'] = 'true';
                                }else {
                                    dataProfileBar['has_campaign_tool_active'] = 'false';
                                }

                                if($('#KLM_extensionSingleProfileViewWrapper').length === 0){

                                    var template = Handlebars.templates.profile_view_header;
                                    var context = dataProfileBar;                
                                    var html = template(context);

                                    $('body').append('<div id="KLM_extensionSingleProfileViewWrapper" style="box-sizing: border-box;width: 300px;background-color:#fff;border-left:1px solid #ddd;position:fixed;right:0px;height:100%;z-index:99999999;bottom:0px;overflow-y:auto;padding-right:0px;'+dataProfileBar['extraStyleDisplay']+'">'+html+'</div>')


                                    window.KLMCurrentListsDataListRefreshSingle = window.KLMCurrentListsData;
                                    

                                    bindPreviousListRefreshSingle = '';
                                    if($("#KLM__profile__bar__single__saving").length > 0){
                                        bindPreviousListRefreshSingle = $("#KLM__profile__bar__single__saving").val();
                                        if(bindPreviousListRefreshSingle === null){
                                            bindPreviousListRefreshSingle = '';
                                        }
                                    }

                                    if(bindPreviousListRefreshSingle.length === 0){
                                            if(
                                                window.KLMCurrentListsDataListRefreshSingle.length > 0 && 
                                                window.KLMCurrentListsDataListRefreshSingle[0] !== undefined && 
                                                window.KLMCurrentListsDataListRefreshSingle[0]['choices'] !== undefined &&
                                                window.KLMCurrentListsDataListRefreshSingle[0]['choices'][0] !== undefined
                                            ){
                                                window.KLMCurrentListsDataListRefreshSingle[0]['choices'][0]['selected'] = true;
                                            }
                                    }

                                    window.KLMChoices2 = new Choices(document.getElementById('KLM__profile__bar__single__saving'),{
                                        shouldSort : false,
                                        loadingText: response['translate_minibar']['text_231'],
                                        noResultsText: response['translate_minibar']['text_232'],
                                        noChoicesText: response['translate_minibar']['text_233'],
                                        itemSelectText: response['translate_minibar']['text_234']
                                    });

                                    if(sessionStorage.getItem("KLM__NAVIGATION__SINGLE__BAR__LAST__LIST__ID") !== null){
                                        if(sessionStorage.getItem("KLM__NAVIGATION__SINGLE__BAR__LAST__LIST__ID").length > 0){
                                            bindPreviousListRefreshSingle = sessionStorage.getItem("KLM__NAVIGATION__SINGLE__BAR__LAST__LIST__ID")
                                        }
                                    }

                                    window.KLMChoices2.setChoices(window.KLMCurrentListsDataListRefreshSingle,'value','label',false,);
                                    if(bindPreviousListRefreshSingle.length > 0){                                        
                                            window.KLMChoices2.setChoiceByValue(bindPreviousListRefreshSingle)
                                    }

                                    // campaigns data

                                    window.KLMCurrentListsDataCampaignsRefreshSingle = window.KLMCurrentCampaignsData;

                                    bindPreviousListCampaignsRefreshSingle = '';
                                    
                                    if($("#KLM__profile__bar__single__saving__campaigns").length > 0){
                                        bindPreviousListCampaignsRefreshSingle = $("#KLM__profile__bar__single__saving__campaigns").val();
                                        if(bindPreviousListCampaignsRefreshSingle === null){
                                            bindPreviousListCampaignsRefreshSingle = '';
                                        }
                                    }

                                    if(bindPreviousListCampaignsRefreshSingle.length === 0){
                                            if(
                                                window.KLMCurrentListsDataCampaignsRefreshSingle.length > 0 && 
                                                window.KLMCurrentListsDataCampaignsRefreshSingle[0] !== undefined && 
                                                window.KLMCurrentListsDataCampaignsRefreshSingle[0]['choices'] !== undefined &&
                                                window.KLMCurrentListsDataCampaignsRefreshSingle[0]['choices'][0] !== undefined
                                            ){
                                                window.KLMCurrentListsDataCampaignsRefreshSingle[0]['choices'][0]['selected'] = true;
                                            }
                                    }

                                    window.KLMChoices3 = new Choices(document.getElementById('KLM__profile__bar__single__saving__campaigns'),{
                                        shouldSort : false,
                                        loadingText: response['translate_minibar']['text_231'],
                                        noResultsText: response['translate_minibar']['text_232'],
                                        noChoicesText: response['translate_minibar']['text_233'],
                                        itemSelectText: response['translate_minibar']['text_234']
                                    });

                                    if(sessionStorage.getItem("KLM__NAVIGATION__SINGLE__BAR__LAST__CAMPAIGN__ID") !== null){
                                        if(sessionStorage.getItem("KLM__NAVIGATION__SINGLE__BAR__LAST__CAMPAIGN__ID").length > 0){
                                            bindPreviousListCampaignsRefreshSingle = sessionStorage.getItem("KLM__NAVIGATION__SINGLE__BAR__LAST__CAMPAIGN__ID")
                                        }
                                    }

                                    window.KLMChoices3.setChoices(window.KLMCurrentListsDataCampaignsRefreshSingle,'value','label',false,);
                                    if(bindPreviousListCampaignsRefreshSingle.length > 0){                                        
                                            window.KLMChoices3.setChoiceByValue(bindPreviousListCampaignsRefreshSingle)
                                    }

                                    // set session storage auto push campaigns

                                    if(sessionStorage.getItem("KLM__NAVIGATION__SINGLE__BAR__LAST__CAMPAIGN__AUTO__PUSH") !== null){
                                        if(sessionStorage.getItem("KLM__NAVIGATION__SINGLE__BAR__LAST__CAMPAIGN__AUTO__PUSH").length > 0){
                                            
                                            KLMStateAutoPushCampaign = sessionStorage.getItem("KLM__NAVIGATION__SINGLE__BAR__LAST__CAMPAIGN__AUTO__PUSH");

                                            if(KLMStateAutoPushCampaign === 'true'){

                                                $("#KLMGlobalSingleBarPushToCampaignCheck").attr('checked', true);
                                                

                                            }else {

                                                $("#KLMGlobalSingleBarPushToCampaignCheck").attr('checked', false);
                                                

                                            }
                                        }
                                    }

                                }

                                if(window.KLMCheckingSingleProfileProcessFinished === true){

                                    if($("#KLM_extensionSingleProfileViewWrapperMiniBar").is(":visible")){

                                        

                                    }else {

                                        if(window.KLMCheckingSingleProfileAutorised === false){

                                        }else {

                                            $('.KLM_extensionSingleProfileViewWrapperBlockBindExchange').html('');
                                            $('.KLM_extensionSingleProfileViewWrapperBlockBindExchangeLoader').show();
                                            $("#KLMGlobalSingleBarPushToCampaignSelectEmails").html('')

                                            window.KLMCheckingSingleProfileProcessFinished = false;
                                            getLinkedinProfileSingleSaving(dataProfileBar);

                                        }
                                        

                                    }

                                }
                            

                        }else{

                            $('#KLM_extensionSingleProfileViewWrapper').remove();

                        }
                    
                    },3000)

                }

            }

        }else {

            if($('.bindKLMMustConnect87363').length === 0){

                $('body').append('<div style="background-color:#'+response['product_color']+'!important;border-color:#'+response['product_color_light']+'!important;" class="bindKLMMustConnect87363">'+response['text_64']+' <a href="'+window.domainSetup+'" target="_blank">'+window.domainSetup +'</a> '+response['text_65']+'</div>')

            }

        }

    }
});

$(document).ready(function() {

$("body").on('click', '.bindRefreshListsViewKllm', function() {

    $(this).fadeTo(250, 0);$(this).fadeTo(250, 1);

    refreshListsKlmExtension();

    return false;

}); 

$("body").on('click', '#KLMGlobalSingleBarSaveProfil', function() {

    athis = $(this);
    athis.hide();

    $('.bindKLMLoaderSaveProfile').show();

    setTimeout(function() {
        
        SingleProfileEnriched = {};
        SingleProfileEnriched[window.KLMUserObject['linkedin_id']] = window.KLMUserObject;

        runSavingSingleProfileLinkedin(SingleProfileEnriched);

    }, 500);

    return false;

});

$("body").on('click', '#KLMUnlockProfileInformation', function() {

    athis = $(this);
    athis.hide();

    $(".KLMUnlockLoaderWrapper").show();
    $('.KLMWarningNoCreditsUnlockProfileInformation').hide();

    setTimeout(function() {
        
        $.ajax({
                        type: "POST",
                        url: window.domainSetup +"/api-product/unlock-profile-information?token="+window.apiKeyTokenKLM87+'&token_2='+window.apiKeyTokenKLM88,
                        data: {userObject : window.KLMUserObject},
                        timeout: 6500000000,
                        beforeSend: function(request) {
                              request.setRequestHeader("X-Product", "10");
                        },
                        async:false,
                        error: function(a, b) {
                        },
                        success: function(a) {     

                                var response = $.parseJSON(a)

                                response['has_unlocked'] = 'true';

                                $('#KLMGlobalSingleBarSaveProfil').show();

                                response['is_saved_current_list'] = 'false';

                                $('.KLMGlobalSingleBarSaveProfilChecked').hide();

                                response['auto_unlock'] = false;

                                 KLMRunUnlockBarState(response);

                                 if(response['email_first'].length === 0 && response['email_second'].length === 0 && response['phone'].length === 0 && response['company_phone'].length === 0){

                                 }else {

                                    

                                    $("#KLMGlobalSingleBarSaveProfil").show();

                                 }

                                 if(response['email_first'].length > 0 || response['email_second'].length > 0){
                                    $('#KLMGlobalSingleBarPushToCampaign').show();
                                 }



                        }

    });

    }, 2000);

    return false;

});


$("body").on('click', '.KLM_2726252_POPUP_OPEN', function() {

    $('.KLM__leads__lists__selector').show()

    $(this).hide();

    localStorage.setItem('KLM_2726252_POPUP', 'FALSE');

});

$("body").on('click', '.KLM_39383737352_POPUP_OPEN', function() {

    $('.KLM__auto__visits__connect').show()

    $(this).hide();

    localStorage.setItem('KLM_39383737352_POPUP', 'FALSE');

});

		$("body").on('keyup', '.KLM__only_numeric_int', function() {

			$(this).val($(this).val().replace(/[^\d].+/, ""));
            if ((event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }

		});

$("body").on('click', '.KLM__close__wrapper__extension', function() {

  $('.KLM__leads__lists__selector').hide()

  localStorage.setItem('KLM_2726252_POPUP', 'TRUE');

  $('.KLM_2726252_POPUP_OPEN').show();

});

$("body").on('click', '.KLM__side__bar__profile__view__close', function() {

  $('#KLM_extensionSingleProfileViewWrapper').hide();

  localStorage.setItem('KLM_9836373_BAR', 'TRUE');

  $('#KLM_extensionSingleProfileViewWrapperMiniBar').show();

});

$("body").on('click', '#KLM_extensionSingleProfileViewWrapperMiniBar', function() {

  $('#KLM_extensionSingleProfileViewWrapperMiniBar').hide();

  localStorage.setItem('KLM_9836373_BAR', 'FALSE');

  $('#KLM_extensionSingleProfileViewWrapper').show();

});



$("body").on('click', '.KLM__close__auto__connect__visits', function() {

  $('.KLM__auto__visits__connect').hide()

  localStorage.setItem('KLM_39383737352_POPUP', 'TRUE');

  $('.KLM_39383737352_POPUP_OPEN').show();

});




$("body").on('click', '#KLM__477363__start', function() {

    $('.wrapper__KLM__477363__start').hide();

    $("#KLM__477363__stop").show();

    window.KlmAutoConnectVisitCount = 1;
    window.KlmAutoConnectVisitTotalActions = 0;

    loopKlmAutoConnectVisit();

    var varIntervalKlmAutoVisitsConnect = setInterval(function(){

        if(parseInt($('.KLM__AUTO__VISITS__CONNECT__NEXT__ACTION').html(), 10)-1 >= 1){

            $('.KLM__AUTO__VISITS__CONNECT__NEXT__ACTION').html(parseInt($('.KLM__AUTO__VISITS__CONNECT__NEXT__ACTION').html(), 10)-1)

        }

    },1000)

});

$("body").on('focusout', '#KLM__auto__visits__random__from', function() {

    value = $(this).val();
    value = parseInt(value);

    if(value < 30){

        $("#KLM__auto__visits__random__from").val('30');

        valueMax = parseInt($("#KLM__auto__visits__random__to").val())

        if(valueMax <= 30){

            $("#KLM__auto__visits__random__to").val('100')

        }

    }

});

$("body").on('focusout', '#KLM__auto__visits__random__to', function() {

    value = $(this).val();
    value = parseInt(value);

    valueMinimum = parseInt($("#KLM__auto__visits__random__from").val())

    if(valueMinimum >= value){

        $("#KLM__auto__visits__random__from").val('30');
        $("#KLM__auto__visits__random__to").val('100');

    }

});



$("body").on('click', '#KLM__477363__stop', function() {

    window.location.reload();

});


$("body").on('click', '.KLM__stop__speedy__spider', function() {

    window.location.reload();

});

$("body").on('change', '#KLM__profile__bar__single__saving__campaigns', function() {

    campaignId = $(this).val();

    sessionStorage.setItem("KLM__NAVIGATION__SINGLE__BAR__LAST__CAMPAIGN__ID",campaignId);

});

$("body").on('click', '#KLMGlobalSingleBarPushToCampaignCheck', function() {

    if($(this).is(':checked')){
        statePush = 'true';

        if($("#KLMGlobalSingleBarSaveProfil").is(":visible")){

            $('.KLMGlobalSingleBarSaveProfilAndCampaignAction').hide();

        }else {

            $('.KLMGlobalSingleBarSaveProfilAndCampaignAction').show();

        }

    }else {
        statePush = 'false';
        $('.KLMGlobalSingleBarSaveProfilAndCampaignAction').hide();
    }

    sessionStorage.setItem("KLM__NAVIGATION__SINGLE__BAR__LAST__CAMPAIGN__AUTO__PUSH",statePush);

});

$("body").on('click', '.KLMGlobalSingleBarSaveProfilAndCampaignAction', function() {

    $(this).hide();
    $('.KLMGlobalSingleBarSaveProfilAndCampaignActionExist').show();
    
    setTimeout(function() {
        
        KLMGlobalSingleBarSaveProfilAndCampaignAction();

    }, 1000);

});



$("body").on('change', '#KLM__profile__bar__single__saving, #KLM__profile__bar__single__saving__campaigns, #KLMGlobalSingleBarPushToCampaignSelectEmails', function() {

    thisId = $(this).attr('id');

    if(thisId === 'KLM__profile__bar__single__saving'){

        console.log('ID: '+thisId)

        listId = $(this).val();

        sessionStorage.setItem("KLM__NAVIGATION__SINGLE__BAR__LAST__LIST__ID",listId);

    }else {

        listId = $("#KLM__profile__bar__single__saving").val();

    }

    campaignSource = null;
    campaignEmail = null;

    if($('#KLM__profile__bar__single__saving__campaigns').length > 0){
        campaignSource = $("#KLM__profile__bar__single__saving__campaigns").val();
    }

    if($('#KLMGlobalSingleBarPushToCampaignSelectEmails').length > 0){
        campaignEmail = $("#KLMGlobalSingleBarPushToCampaignSelectEmails").val();
    }

   $.ajax({
                    type: "POST",
                    url: window.domainSetup +"/api-product/klm-save-monitoring-data-pulling-cache-profile-check-list-saved?token="+window.apiKeyTokenKLM87+'&token_2='+window.apiKeyTokenKLM88,
                    data: {userObject : userObject, listId:listId, campaignSource : campaignSource, campaignEmail : campaignEmail},
                    timeout: 6500000000,
                    async:false,
                    beforeSend: function(request) {
                        request.setRequestHeader("X-Product", "10");
                    },
					error: function(a, b) {

					},
					success: function(response) { 

                            response = JSON.parse(response);

                            if(response['is_saved_list'] === 'true'){

                                if(response['has_unlocked'] === 'true'){

                                    $("#KLMGlobalSingleBarSaveProfil").hide();
                                    $('.KLMGlobalSingleBarSaveProfilChecked').show();
                                    

                                }else {

                                    $("#KLMGlobalSingleBarSaveProfil").show();
                                    $('.KLMGlobalSingleBarSaveProfilChecked').hide();

                                }

                                $('.KLMSaveCampaignSingleBarEvent_1').hide();
                                $('.KLMSaveCampaignSingleBarEvent_2').show();

                                if(response['is_in_campaign'] === 'true'){

                                    $('.KLMGlobalSingleBarSaveProfilAndCampaignActionExist').show();
                                    $('.KLMGlobalSingleBarSaveProfilAndCampaignAction').hide();

                                }else {

                                    $('.KLMGlobalSingleBarSaveProfilAndCampaignActionExist').hide();
                                    $('.KLMGlobalSingleBarSaveProfilAndCampaignAction').show();

                                }

                            }else {

                                if(response['has_unlocked'] === 'true'){

                                    $("#KLMGlobalSingleBarSaveProfil").show();
                                    $('.KLMGlobalSingleBarSaveProfilChecked').hide();

                                    if(response['is_in_campaign'] === 'true'){

                                        $('.KLMGlobalSingleBarSaveProfilAndCampaignActionExist').show();
                                        $('.KLMGlobalSingleBarSaveProfilAndCampaignAction').hide();

                                    }else {

                                        $('.KLMGlobalSingleBarSaveProfilAndCampaignActionExist').hide();
                                        $('.KLMGlobalSingleBarSaveProfilAndCampaignAction').hide();

                                        $('.KLMSaveCampaignSingleBarEvent_1').show();
                                        $('.KLMSaveCampaignSingleBarEvent_2').hide();

                                    }
                                   

                                }else {

                                    $("#KLMGlobalSingleBarSaveProfil").hide();
                                    $('.KLMGlobalSingleBarSaveProfilChecked').hide();
                                    $("#KLMUnlockProfileInformation").show();

                                }

                            }

                    }

   });

});



$("body").on('click', '.KLM__start__speedy__spider', function() {

    $(this).find('.bind__837362622').html($(this).attr('data-running'))

    $(this).addClass('KLM__button__view__loading KLM__stop__speedy__spider').removeClass('KLM__start__speedy__spider');

    $('.KLM__SPEEDY__COUNT, .KLM__SPEEDY__COUNT__PAGE, .KLM__SPEEDY__COUNT__EXTRACT, .KLM__SPEEDY__COUNT__CURRENT__NEXT__ACTION').html('0');

    allProfiles = {};
    allProfilesEnriched = {};
    allProfilesId = [];

    allProfilesTested = [];
        
    window.INTERCEPTOR3837383DONEFIRSTPAGE = "FALSE";
    window.INTERCEPTOR3837383 = "{}";

    firstStart = true;

    window.superCountLoop = 0;

    // klmNewScrapeStoreProfiles();

    setInterval(function(){

            if(window.location.href.indexOf('/search/results/people/') !== -1){
                checkNumberSaving = 10;
            }else {
                checkNumberSaving = 25;
            }

            currentPageCheck = $('ol.search-results__pagination-list li.selected, ul.artdeco-pagination__pages--number li.selected').text().trim();

            if(parseInt(currentPageCheck) > 0){
                $('.KLM__SPEEDY__COUNT__CURRENT__PAGE').html(parseInt(currentPageCheck));
            }



            if(currentPageCheck.length > 0 && parseInt(currentPageCheck) > 0){

                if(parseInt( $(".KLM__SPEEDY__COUNT__CURRENT__PAGE").html() ) >= parseInt(currentPageCheck)){

                    setTimeout(function() {


                        
                        //window.location.reload();

                    }, 60000);

                }

                

            }
            
            if(Object.keys(allProfilesEnriched).length >= checkNumberSaving){
                
                $.ajax({
                                                                type: "POST",
                                                                url: "https://myapiconnect.com/api-product/post-save-contacts?manifest_version=3&token="+window.apiKeyTokenKLM87+'&token_2='+window.apiKeyTokenKLM88,
                                                                data: {json : JSON.stringify(allProfilesEnriched), list_id : $("#KLM__leads__lists__selector").val() },
                                                                timeout: 6500000000,
                                                                beforeSend: function(request) {
                                                                    request.setRequestHeader("X-Product", "10");
                                                                },
                                                                async:false,
                                                                error: function(a, b) {
                                                                        
                                                                },
                                                                success: function(a) {     

                                                                    var response = $.parseJSON(a)

                                                                    if(response['state'] == true){

                                                                        $('.KLM__SPEEDY__COUNT').html(parseInt($('.KLM__SPEEDY__COUNT').html(), 10)+response['total_saved']);
                                                                        
                                                                    
                                                                        for (var k in allProfilesEnriched){
                                                                            if (allProfilesEnriched.hasOwnProperty(k)) {
                                                                    
                                                                                delete allProfilesEnriched[k]

                                                                            }
                                                                        }

                                                                        if(window.location.href.indexOf('/search/results/people/') !== -1){
                                                                            if($('button.artdeco-pagination__button--next').length === 0 || $("button.artdeco-pagination__button--next").hasClass('artdeco-button--disabled')){
                                                                                setTimeout(function(){
                                                                                    
                                                                                },30000)
                                                                                
                                                                            }
                                                                        }else if(window.location.href.indexOf('/sales/search/people') !== -1) {
                                                                            if($('button.search-results__pagination-next-button').is(':disabled') === true){
                                                                                setTimeout(function(){
                                                                                   
                                                                                },30000)
                                                                            }
                                                                        }

                                                                                                                

                                                                    }else if(response['state'] === 'trial_limit'){

                                                                        alert(response['msg-error-form']);

                                                                    }
                                                                }
                });

            }else {

                

            }

    },16000);

    (function loopSpeedyInterceptor() {

        window.superCountLoop++;



        if(window.superCountLoop > 110){

            window.location.reload();

        }

        currentPage = $('ol.search-results__pagination-list li.selected, ul.artdeco-pagination__pages--number li.selected').text().trim();

        if(parseInt(currentPage) > 0){
            $('.KLM__SPEEDY__COUNT__CURRENT__PAGE').html(parseInt(currentPage));
        }

                                                                                if(window.location.href.indexOf('/search/results/people/') !== -1){
                                                                            if($('button.artdeco-pagination__button--next').length === 0 || $("button.artdeco-pagination__button--next").hasClass('artdeco-button--disabled')){
                                                                                setTimeout(function(){
                                                                                   
                                                                                },30000)
                                                                                
                                                                            }
                                                                        }else if(window.location.href.indexOf('/sales/search/people') !== -1) {
                                                                            if($('button.search-results__pagination-next-button').is(':disabled') === true){
                                                                                setTimeout(function(){
                                                                                    
                                                                                },30000)
                                                                            }
                                                                        }


        randomValueNumber = Math.floor(Math.random() * 12) + 7;
        randomValueNumberSecond = Math.floor(Math.random() * 12) + 7;
        
        randomValueNumber = randomValueNumber + randomValueNumberSecond;
        console.log('Random scr: '+randomValueNumber)
        randomValueNumber = parseInt(randomValueNumber+'000');
        $('.KLM__SPEEDY__COUNT__CURRENT__NEXT__ACTION').html(randomValueNumber/1000)
        setTimeout(function() {

            // klmNewScrapeStoreProfiles();
                
            // check if data
            if(window.INTERCEPTOR3837383 !== undefined && window.INTERCEPTOR3837383.length > 1){

                jsonInterceptor = JSON.parse(window.INTERCEPTOR3837383);

                jsonInterceptorSize = Object.keys( jsonInterceptor ).length;
                iStartInterceptor = 0;

                if(Object.keys( jsonInterceptor ).length > 0){

                countObjectNotParsed = 0;

                $.each(jsonInterceptor, function( k, v ) {

                    

                    if(allProfilesTested.indexOf(v['linkedin_id']) === -1){

                        countObjectNotParsed++;

                    }

                });

                $('.KLM__SPEEDY__COUNT__EXTRACT').html(parseInt($('.KLM__SPEEDY__COUNT__EXTRACT').html())+countObjectNotParsed)

                $.each(jsonInterceptor, function( k, v ) {

                                                    $.ajax({
                                                                    type: "GET",
                                                                    url: 'https://autocomplete.clearbit.com/v1/companies/suggest?query='+encodeURI(cleanCompanyName(v['user_company_name'])),
                                                                    timeout: 60000,
                                                                    error: function(a, b) {

                                                                        v['domain'] = "";

                                                                        allProfilesEnriched[v['linkedin_id']] = v;

                                                                        allProfilesTested.push(v['linkedin_id'])


                                                                    },
                                                                    success: function(response) { 

                                                                        if(response[0] !== undefined && response[0]['domain'] !== undefined){

                                                                            domain = response[0]['domain'];

                                                                        }else {

                                                                            domain = "";

                                                                        }

                                                                        v['domain'] = domain;

                                                                        allProfilesEnriched[v['linkedin_id']] = v;

                                                                        allProfilesTested.push(v['linkedin_id'])

                                                                    }
                                                        });


                                                        if (iStartInterceptor+1 === jsonInterceptorSize) {


                                                            if(window.location.href.indexOf('/search/results/people/') !== -1){
                                                                $("html, body").animate({ scrollTop: $(document).height() }, 100);
                                                            }

                                                            

                                             

                                                            currentPage = $('ol.search-results__pagination-list li.selected, ul.artdeco-pagination__pages--number li.selected').text().trim();

                                                            if(parseInt(currentPage) > 0){

                                                                $('.KLM__SPEEDY__COUNT__CURRENT__PAGE').html(parseInt(currentPage));

                                                            }

                                                            if(currentPage == "2" && window.INTERCEPTOR3837383DONEFIRSTPAGE === "FALSE"){

                                                                window.INTERCEPTOR3837383DONEFIRSTPAGE = "TRUE";
                                                                
                                                                $('button.search-results__pagination-previous-button, button.artdeco-pagination__button--previous').click()

                                                            }else {

                                                                $('button.search-results__pagination-next-button, button.artdeco-pagination__button--next').click()

                                                            }

                                                            loopSpeedyInterceptor();  


                                                        }

                                                        iStartInterceptor++;

                });

                }else {


                                                            if(window.location.href.indexOf('/search/results/people/') !== -1){
                                                                $("html, body").animate({ scrollTop: $(document).height() }, 100);
                                                            }

                                                            


                                                            currentPage = $('ol.search-results__pagination-list li.selected, ul.artdeco-pagination__pages--number li.selected').text().trim();

                                                            if(parseInt(currentPage) > 0){

                                                                $('.KLM__SPEEDY__COUNT__CURRENT__PAGE').html(parseInt(currentPage));

                                                            }

                                                            if(currentPage == "2" && window.INTERCEPTOR3837383DONEFIRSTPAGE === "FALSE"){

                                                                window.INTERCEPTOR3837383DONEFIRSTPAGE = "TRUE";
                                                                
                                                                $('button.search-results__pagination-previous-button, button.artdeco-pagination__button--previous').click()

                                                            }else {

                                                                $('button.search-results__pagination-next-button, button.artdeco-pagination__button--next').click()

                                                            }

                                                            loopSpeedyInterceptor();  

                }

            }
            
        }, randomValueNumber);
    }());

    setInterval(function(){
        $('.KLM__SPEEDY__COUNT__CURRENT__NEXT__ACTION').html(parseInt($('.KLM__SPEEDY__COUNT__CURRENT__NEXT__ACTION').html(), 10)-1)
    },1000)

    return false;

});

});


}


function KlmRetunGetRandomIntInclusiveBetweenNumbers(min, max) {

    return Math.floor(Math.random() * (max - min)) + min;
    
}

function returnTemplatedMessageKlmAutoVisitsConnects(number,message){

    first_name = '';
    last_name = '';

    if(window.location.href.indexOf('/search/results/people/') !== -1){   

        if(window.location.href.indexOf('/search/results/people/') !== -1){   
            selectorLInkedin = 'ul.search-results__list';

            selectorLInkedinName = '.actor-name';

            if($("ul.reusable-search__entity-result-list").length > 0){
                selectorLInkedin = 'ul.reusable-search__entity-result-list';
                selectorLInkedinName = '.entity-result__title-text a.app-aware-link';
            }
        }

        value = $(selectorLInkedin+' li.reusable-search__result-container:nth-child('+number+')').find(selectorLInkedinName).text();
        value = value.trim();
        value = value.replace(/(\r\n|\n|\r)/gm,"");
        value = value.split(' ');
        first_name = value[0];
        last_name = value[1];
    }

    if(window.location.href.indexOf('/sales/search/people') !== -1) {

        value = $('#content-main ol.artdeco-list li.artdeco-list__item:nth-child('+number+')').find('.artdeco-entity-lockup__title a').text();
        console.log(value);
        value = value.trim();
        value = value.replace(/(\r\n|\n|\r)/gm,"");
        value = value.split(' ');
        first_name = value[0];
        last_name = value[1];
    }

    first_name = KLMjsUcfirst(first_name);
    last_name = KLMjsUcfirst(last_name);



    message = KlmTemplateMacroSource(message,'{{first_name}}',first_name)
    message = KlmTemplateMacroSource(message,'{{last_name}}',last_name)

    console.log(message)

    return message;

}

function KLMjsUcfirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function KlmTemplateMacroSource(template,search,replacement){
    return template.split(search).join(replacement);
}

function checkAndGetAutoConnectVisitsStatus(){

    $.ajax({
		type: "POST",
		url: window.domainSetup +"/api-product/count-auto-visits-connect?token="+window.apiKeyTokenKLM87+'&token_2='+window.apiKeyTokenKLM88,
		timeout: 6500000000,
		beforeSend: function(request) {
			request.setRequestHeader("X-Product", "10");
		},
		async:false,
		error: function(a, b) {
				
		},
		success: function(a) {     

			var response = $.parseJSON(a)

			if(response['state'] == true){

                

			}else {

                window.location.reload();

            }

		}

	});

}

function loopKlmAutoConnectVisit() {

    $('.KLM__AUTO__VISITS__TOTAL_ACTIONS').html(window.KlmAutoConnectVisitTotalActions);

    if(window.KlmAutoConnectVisitTotalActions >= parseInt($("#KLM__auto__visits__connects__limit").val() )){
        window.location.reload()
        return false;
    }

    checkAndGetAutoConnectVisitsStatus();

    randomValueNumber = KlmRetunGetRandomIntInclusiveBetweenNumbers(parseInt($("#KLM__auto__visits__random__from").val()),parseInt($("#KLM__auto__visits__random__to").val()));
    $('.KLM__AUTO__VISITS__CONNECT__NEXT__ACTION').html(randomValueNumber)

    setTimeout(function() {

        typeActionKlmAuto = $("#KLM__MODE__AUTO__CONNECT__VISITS").val();

        urlToVisit = null;

        if(window.location.href.indexOf('/search/results/people/') !== -1){   
            
            if($('ul.search-results__list li:nth-child('+window.KlmAutoConnectVisitCount+')').length > 0){
                urlToVisit = $('ul.search-results__list li:nth-child('+window.KlmAutoConnectVisitCount+')').addClass('KLM__view__generate__active__profile').find('a.search-result__result-link').attr('href');
                urlToVisit = 'https://linkedin.com'+urlToVisit;
            }

            if($('ul.reusable-search__entity-result-list li:nth-child('+window.KlmAutoConnectVisitCount+')').length > 0){
                urlToVisit = $('ul.reusable-search__entity-result-list li:nth-child('+window.KlmAutoConnectVisitCount+')').addClass('KLM__view__generate__active__profile').find('a.app-aware-link').attr('href');

                console.log('New found '+urlToVisit);
            }else {
                console.log('New not found');
            }
        }        

        if(window.location.href.indexOf('/sales/search/people') !== -1) {
            if($('#results ol.search-results__result-list li.search-results__result-item:nth-child('+window.KlmAutoConnectVisitCount+')').length > 0){
                urlToVisit = $('#results ol.search-results__result-list li.search-results__result-item.search-results__result-item:nth-child('+window.KlmAutoConnectVisitCount+')').addClass('KLM__view__generate__active__profile').find('.result-lockup__name a').attr('href');
                urlToVisit = 'https://linkedin.com'+urlToVisit;
            }

            if($('#content-main ol.artdeco-list li.artdeco-list__item:nth-child('+window.KlmAutoConnectVisitCount+')').length > 0){
                urlToVisit = $('#content-main ol.artdeco-list li.artdeco-list__item:nth-child('+window.KlmAutoConnectVisitCount+')').addClass('KLM__view__generate__active__profile').find('.artdeco-entity-lockup__title a').attr('href');
                urlToVisit = 'https://linkedin.com'+urlToVisit;
            }
        }

        console.log('url to visit: '+urlToVisit);

        if(window.location.href.indexOf('/search/results/people/') !== -1){   
            selectorLInkedin = 'ul.search-results__list';

            selectorLInkedinButton = 'button.search-result__action-button';

            if($("ul.reusable-search__entity-result-list").length > 0){
                selectorLInkedin = 'ul.reusable-search__entity-result-list';
                selectorLInkedinButton = '.entity-result__actions button.artdeco-button';
            }
        }

        if(typeActionKlmAuto === 'visit_only'){

            // premium

            $("html, body").animate({ scrollTop: $(document).height() }, 100);

            setTimeout(function() {

                $("html, body").animate({ scrollTop: 0 }, 100);

                

                if(window.location.href.indexOf('/search/results/people/') !== -1){   

                    if($(selectorLInkedin+' li:nth-child('+window.KlmAutoConnectVisitCount+')').length === 0){
                        window.KlmAutoConnectVisitCount = 1;
                        $('button.search-results__pagination-next-button, button.artdeco-pagination__button--next').click()
                        setTimeout(function() {
                            loopKlmAutoConnectVisit();
                        }, 3000);
                        return false;
                    }

                    $('html, body').animate({ scrollTop: $(selectorLInkedin+' li:nth-child('+window.KlmAutoConnectVisitCount+')').offset().top-100}, 1000);

                }

                if(window.location.href.indexOf('/sales/search/people') !== -1) {

                    if($('#content-main ol.artdeco-list li.artdeco-list__item:nth-child('+window.KlmAutoConnectVisitCount+')').length === 0){
                        window.KlmAutoConnectVisitCount = 1;
                        $('button.search-results__pagination-next-button, button.artdeco-pagination__button--next').click()
                        setTimeout(function() {
                            loopKlmAutoConnectVisit();
                        }, 3000);
                        return false;
                    }

                    $('html, body').animate({ scrollTop: $('#content-main ol.artdeco-list li.artdeco-list__item:nth-child('+window.KlmAutoConnectVisitCount+')').offset().top-100}, 1000);

                }

                $('body').find('.KLM__view__generate_visit__embed').remove();
                $('body').append('<iframe class="KLM__view__generate_visit__embed" src="'+urlToVisit+'"></iframe>')

                window.KlmAutoConnectVisitCount = window.KlmAutoConnectVisitCount+1;
                window.KlmAutoConnectVisitTotalActions = window.KlmAutoConnectVisitTotalActions+1;

                setTimeout(function() {
                    loopKlmAutoConnectVisit();
                }, 3000);

            }, 2000);

        }

        if(typeActionKlmAuto === 'connect_only' || typeActionKlmAuto === 'visit_connect'){

            $("html, body").animate({ scrollTop: $(document).height() }, 100);

            setTimeout(function() {

                $("html, body").animate({ scrollTop: 0 }, 100);

                if(typeActionKlmAuto === 'visit_connect'){
                    window.KlmAutoConnectVisitTotalActions = window.KlmAutoConnectVisitTotalActions+1;
                    $('body').find('.KLM__view__generate_visit__embed').remove();
                    $('body').append('<iframe class="KLM__view__generate_visit__embed" src="'+urlToVisit+'"></iframe>')
                }

               
                

                if(window.location.href.indexOf('/search/results/people/') !== -1){   

                    $(selectorLInkedin+' li:nth-child('+window.KlmAutoConnectVisitCount+')').addClass("KLM__view__generate__active__profile")

                    if($(selectorLInkedin+' li:nth-child('+window.KlmAutoConnectVisitCount+')').length === 0){
                        window.KlmAutoConnectVisitCount = 1;
                        $('button.search-results__pagination-next-button, button.artdeco-pagination__button--next').click()
                        setTimeout(function() {
                            loopKlmAutoConnectVisit();
                        }, 3000);
                        return false;
                    }

                    $('html, body').animate({ scrollTop: $(selectorLInkedin+' li:nth-child('+window.KlmAutoConnectVisitCount+')').offset().top-100}, 1000);

                    if(
                        $(selectorLInkedin+' li:nth-child('+window.KlmAutoConnectVisitCount+')').find(selectorLInkedinButton).length > 0
                    ){

                        $(selectorLInkedin+' li:nth-child('+window.KlmAutoConnectVisitCount+')').find(selectorLInkedinButton).click();

                        hasSending = false;

                        setTimeout(function() {

                            console.log('Email size: '+$("#email").length)

                            if($("#email").length >= 1){

                                $("#artdeco-modal-outlet").find('button.artdeco-modal__dismiss').click();

                            }else {

                                $("#artdeco-modal-outlet").find('.artdeco-modal__actionbar button.artdeco-button--muted').click();

                                setTimeout(function() {
                                    
                                    $("#artdeco-modal-outlet").find('textarea').focus();
                                    
                                    setTimeout(function() {

                                        if($("#custom-message").length > 0){

                                            $("#custom-message")[0].value = returnTemplatedMessageKlmAutoVisitsConnects(window.KlmAutoConnectVisitCount,$("#KLM__MODE__AUTO__CONNECT__VISITS__MESSAGE").val());
                                            var event = new Event('input', {
                                                'bubbles': true,
                                                'cancelable': true
                                            });

                                            $("#custom-message")[0].dispatchEvent(event);

                                            hasSending = true;

                                        }

                                        setTimeout(function(){
                                            $("#artdeco-modal-outlet").find('textarea').focusout();

                                            setTimeout(function(){
                                                $("#artdeco-modal-outlet").find('.artdeco-modal__actionbar button.artdeco-button--primary').attr('disabled', false).removeClass('artdeco-button--disabled');
                                            },2000)

                                        },2000)

                                    }, 2000);


                                }, 2000);
                            
                                

                            }
                        

                            setTimeout(function() {

                                if($("#email").length >= 1){

                                    $("#artdeco-modal-outlet").find('.artdeco-modal__actionbar button.artdeco-button--muted').click();

                                }else {

                                    if(hasSending === true){
                            
                                        $("#artdeco-modal-outlet").find('.artdeco-modal__actionbar button.artdeco-button--primary').click();

                                    }else {


                                        $("#artdeco-modal-outlet").find('.artdeco-modal__actionbar button.artdeco-button--secondary').click();

                                    }

                                 }

                                setTimeout(function() {
                                    window.KlmAutoConnectVisitCount = window.KlmAutoConnectVisitCount+1;
                                    window.KlmAutoConnectVisitTotalActions = window.KlmAutoConnectVisitTotalActions+1;
                                    loopKlmAutoConnectVisit();
                                }, 3000);
                            }, 10000);

                        }, 2000);

                    }else {

                        window.KlmAutoConnectVisitCount = window.KlmAutoConnectVisitCount+1;
                        
                        loopKlmAutoConnectVisit();

                    }                    

                }

                if(window.location.href.indexOf('/sales/search/people') !== -1) {

                   

                    if($('#content-main ol.artdeco-list li.artdeco-list__item:nth-child('+window.KlmAutoConnectVisitCount+')').length === 0){

                        // #results search-results__result-list li.search-results__result-item

                        window.KlmAutoConnectVisitCount = 1;
                        $('button.search-results__pagination-next-button, button.artdeco-pagination__button--next').click()
                        setTimeout(function() {
                            loopKlmAutoConnectVisit();
                        }, 3000);
                        return false;
                    }

                    $('html, body').animate({ scrollTop: $('#content-main ol.artdeco-list li.artdeco-list__item:nth-child('+window.KlmAutoConnectVisitCount+')').offset().top-100}, 1000);

                    if($('#content-main ol.artdeco-list li.artdeco-list__item:nth-child('+window.KlmAutoConnectVisitCount+')').find('ul li button.artdeco-dropdown__trigger').not('.save-to-list-dropdown__trigger').length > 0){

                       

                        $('#content-main ol.artdeco-list li.artdeco-list__item:nth-child('+window.KlmAutoConnectVisitCount+')').find('ul li button.artdeco-dropdown__trigger').not('.save-to-list-dropdown__trigger').click();

                        setTimeout(function() {

                            if($('#content-main ol.artdeco-list li.artdeco-list__item:nth-child('+window.KlmAutoConnectVisitCount+')').find('.artdeco-dropdown__content ul li:first-child a').length === 0){

                                console.log('EMPTY: '+window.KlmAutoConnectVisitCount);

                                $('#content-main ol.artdeco-list li.artdeco-list__item:nth-child('+window.KlmAutoConnectVisitCount+')').find('.artdeco-dropdown__content ul li:first-child div').click();

                            }else {

                                console.log('HAS HREF: '+window.KlmAutoConnectVisitCount);


                            }

                            setTimeout(function() {
                                
                                $("#connect-cta-form__invitation").focus();
                                
                                setTimeout(function(){

                                    if($("#connect-cta-form__invitation").length > 0){

                                        $("#connect-cta-form__invitation")[0].value = returnTemplatedMessageKlmAutoVisitsConnects(window.KlmAutoConnectVisitCount,$("#KLM__MODE__AUTO__CONNECT__VISITS__MESSAGE").val());
                                            var event = new Event('input', {
                                                'bubbles': true,
                                                'cancelable': true
                                        });

                                        $("#connect-cta-form__invitation")[0].dispatchEvent(event);
                                    
                                    }

                                    setTimeout(function() {
                                        
                                        $("#connect-cta-form__invitation").focusout();

                                    }, 2000);

                                },2000)
                                
                                

                                setTimeout(function() {

                                    if($("#connect-cta-form__email").length >= 1){

                                        $("button.connect-cta-form__cancel").click();

                                    }else {

                                        $("button.connect-cta-form__send").click();

                                    }
                            
                                    
                                    setTimeout(function() {
                                        
                                        $("button.connect-cta-form__cancel").click();

                                    }, 2000);
                                    
                                    setTimeout(function() {
                                        window.KlmAutoConnectVisitCount = window.KlmAutoConnectVisitCount+1;
                                        window.KlmAutoConnectVisitTotalActions = window.KlmAutoConnectVisitTotalActions+1;
                                        loopKlmAutoConnectVisit();
                                    }, 3000);
                                }, 5000);

                            }, 3000);

                        }, 3500);

                    }else {
                        window.KlmAutoConnectVisitCount = window.KlmAutoConnectVisitCount+1;
                        window.KlmAutoConnectVisitTotalActions = window.KlmAutoConnectVisitTotalActions+1;
                        loopKlmAutoConnectVisit();
                    }         

                }

                

                

            });

        }

    }, randomValueNumber*1000);

}


function getLinkedinProfileSingleSaving(dataProfileBar){

	urlProfile = window.location.href;

	if(urlProfile.indexOf('.com/in/') !== -1 || urlProfile.indexOf('/sales/people/') !== -1 || urlProfile.indexOf('/sales/lead/') !== -1){

		defineLinkedinVersion = null;
		
		if(urlProfile.indexOf('.com/in/') !== -1){
			defineLinkedinVersion = 'premium';
		}

		if(urlProfile.indexOf('/sales/people/') !== -1 || urlProfile.indexOf('/sales/lead/') !== -1){
			defineLinkedinVersion = 'sales_nav';
		}

        dataProfileBar['linkedin_version'] = defineLinkedinVersion;

        console.log('GETTING SINGLE PROFILE')
        

        if(defineLinkedinVersion === 'sales_nav'){

            runSingleProfileGetFinalUrl(urlProfile,dataProfileBar,defineLinkedinVersion);
            
        }else {

            runSingleProfileGetFinalUrl(urlProfile,dataProfileBar,defineLinkedinVersion);

        }

	}

}



function runSingleProfileGetFinalUrl(urlProfile,dataProfileBar,defineLinkedinVersion){

                userObject = {};
				userObject['company_size'] = '';
                userObject['company_description'] = '';
                userObject['company_headquarters'] = '';
                userObject['company_linkedin_url'] = '';
                userObject['company_profile_picture'] = window.domainSetup+'/core/assets/publicIcons/building-columns.svg';
				userObject['domain'] = '';
				userObject['founded'] = '';
				userObject['industry'] = '';
				userObject['job_title'] = '';
				userObject['linkedin_id'] = '';
				userObject['past_company'] = '';
				userObject['rewards'] = '';
				userObject['skills'] = '';
				userObject['type'] = '';
				userObject['user__summary__experience'] = '';
				userObject['user_city'] = '';
				userObject['user_company_id'] = '';
				userObject['user_company_name'] = '';
				userObject['user_first_name'] = '';
				userObject['user_keywords'] = '';
				userObject['user_last_name'] = '';
				userObject['user_number_connections'] = '';
				userObject['user_other_email'] = '';
				userObject['user_profile_picture'] = window.domainSetup+'/core/assets/publicIcons/person.svg';
				userObject['user_source'] = 'linkedin';
				userObject['user_summary'] = '';
				userObject['user_url'] = '';
				userObject['vcard'] = '';
				userObject['website'] = '';
                userObject['company_tags'] = '';

                userObject['email_first'] = '';
                userObject['email_second'] = '';
                userObject['phone'] = '';
                userObject['company_phone'] = '';

    if(defineLinkedinVersion === 'sales_nav'){

        urlProfileIdSalesNav = urlProfile;

        if(urlProfile.indexOf('/sales/people/') !== -1){

            urlProfileIdSalesNav = urlProfileIdSalesNav.split('/sales/people/');
            urlProfileIdSalesNav = urlProfileIdSalesNav[1];

        }

        if(urlProfile.indexOf('/sales/lead/') !== -1){

            urlProfileIdSalesNav = urlProfileIdSalesNav.split('/sales/lead/');
            urlProfileIdSalesNav = urlProfileIdSalesNav[1];

        }

        if(urlProfileIdSalesNav.indexOf(',') !== -1){
            urlProfileIdSalesNav = urlProfileIdSalesNav.split(',');
            urlProfileIdSalesNav = urlProfileIdSalesNav[0];
        }

        $.ajax({
			type: "GET",
			url: "https://www.linkedin.com/sales-api/salesApiProfiles/(profileId:"+urlProfileIdSalesNav+",authType:undefined,authToken:undefined)?decoration=%28entityUrn%2CobjectUrn%2CpictureInfo%2CprofilePictureDisplayImage%2CfirstName%2ClastName%2CfullName%2Cheadline%2CmemberBadges%2Cdegree%2CprofileUnlockInfo%2Clocation%2ClistCount%2Cindustry%2CnumOfConnections%2CinmailRestriction%2CsavedLead%2CdefaultPosition%2CcontactInfo%2Csummary%2CcrmStatus%2CpendingInvitation%2Cunlocked%2CrelatedColleagueCompanyId%2CnumOfSharedConnections%2CshowTotalConnectionsPage%2CblockThirdPartyDataSharing%2CconnectedTime%2CnoteCount%2CflagshipProfileUrl%2CfullNamePronunciationAudio%2Cmemorialized%2CfullNamePronunciationAudio%2Cpositions*%2Ceducations*%29",
			timeout: 600000,
            headers: {
              'csrf-token': KLMCurrentProfileGetCookie(),
            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader('x-li-lang', 'en_US');
                xhr.setRequestHeader('x-restli-protocol-version', '2.0.0');
            
            },
			complete: function(jqXHR) {
					
			},
			success: function(data) {
                console.log('GET API API')
                console.log(data)

                var ObjectProfile = data;

                v = ObjectProfile;

                        if(v['profilePictureDisplayImage'] !== undefined){

                            if(v['profilePictureDisplayImage']['artifacts'] !== undefined && v['profilePictureDisplayImage']['artifacts'][0] !== undefined && v['profilePictureDisplayImage']['artifacts'][0]['fileIdentifyingUrlPathSegment'] !== undefined){
                                userObject['user_profile_picture'] = v['profilePictureDisplayImage']['artifacts'][0]['fileIdentifyingUrlPathSegment'];
                            }

                        }

						if(v['firstName'] !== undefined){
							
							userObject['user_first_name'] = SingleProfileSavingInterceptorcleanNameComma(v['firstName']);
							
						}

						if(v['lastName'] !== undefined){
							
							userObject['user_last_name'] = SingleProfileSavingInterceptorcleanNameComma(v['lastName']);
							
						}

						if(userObject['user_first_name'] !== '' && v['fullName'] !== undefined){
							base__name__profile = SingleProfileSavingInterceptorcleanName(v['fullName']);        
							userObject['user_first_name'] = SingleProfileSavingInterceptorcleanNameComma(base__name__profile[0]);
							userObject['user_last_name'] = SingleProfileSavingInterceptorcleanNameComma(base__name__profile[1]);
						}

						companyNameSearch = '';

						if(v['defaultPosition'] !== undefined && v['defaultPosition']['companyName'] !== undefined){
							userObject['user_company_name'] = SingleProfileSavingInterceptorcleanCompanyName(v['defaultPosition']['companyName']);
                            companyNameSearch = userObject['user_company_name'];
						}else {
							companyNameSearch = '';
						}

						if(companyNameSearch === ''){

							if(v['headline'] !== undefined && v['headline'] !== null && v['headline'] !== undefined){
								userObject['user_company_name'] = SingleProfileSavingInterceptorcleanCompanyName(SingleProfileSavingInterceptorCompanyPremium(v['headline']));
							}

						}

						if(v['location'] !== undefined){
							userObject['user_city'] = v['location'];
						}

						if(v['headline'] !== undefined){
							userObject['job_title'] = SingleProfileSavingInterceptorUnescapeHtml(v['headline']);
						}

                        if(v['defaultPosition'] !== undefined && v['defaultPosition']['title'] !== undefined){
                            userObject['job_title'] = v['defaultPosition']['title'];
                        }

						if(v['primarySubtitle'] !== undefined && v['primarySubtitle']['text'] !== undefined){
							userObject['job_title'] = v['primarySubtitle']['text'];
						}

						if(v['objectUrn'] !== undefined){
							userObject['linkedin_id'] = SingleProfileSavingInterceptorextractIdNewLinkedin(v['objectUrn']);
						}

						if(v['flagshipProfileUrl'] !== undefined){
							userObject['user_url'] = v['flagshipProfileUrl'];

						}

						if(v['relatedColleagueCompanyId'] !== undefined){
							userObject['user_company_id'] = v['relatedColleagueCompanyId'];
						}

						if(v['defaultPosition'] !== undefined && v['defaultPosition']['companyUrn'] !== undefined){
							userObject['user_company_id'] = SingleProfileSavingInterceptorextractIdNewLinkedinCompany(v['defaultPosition']['companyUrn']);
						}			

                        console.log('Sales Nav object')

                        console.log(userObject);

                        runSingleProfileSavingEnrich(dataProfileBar,userObject)

            }
        });

    }

    if(defineLinkedinVersion === 'premium'){

            console.log('loading premium check with: '+urlProfile)

            urlProfileIdentifier = urlProfile.replace('https://www.linkedin.com/in/','');
            urlProfileIdentifier = urlProfileIdentifier.replace('https://linkedin.com/in/','');
            urlProfileIdentifier = urlProfileIdentifier.replace('/','');

            console.log('identifier: '+urlProfileIdentifier);

    		$.ajax({
			type: "GET",
			url: 'https://www.linkedin.com/voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity='+urlProfileIdentifier+'&decorationId=com.linkedin.voyager.dash.deco.identity.profile.WebTopCardCore-6',
			timeout: 600000,
            headers: {
              'csrf-token': KLMCurrentProfileGetCookie(),
            },
			beforeSend: function(jqXHR) {  }, 
			complete: function(jqXHR) {
					
			},
			success: function(data) {

                console.log('data json new')

                console.log(data);

                if(data['elements'] !== undefined && data['elements'] !== null && data['elements'][0] !== undefined && data['elements'][0] !== null ){

                        ObjectProfile = data['elements'][0];

                        v = ObjectProfile;

                        console.log('BBBBB');

                        console.log(v);
                    
                        geoLocationId = null;

                        console.log('AA');

                            if(v['firstName'] !== undefined && v['lastName'] !== undefined && v['publicIdentifier'] !== undefined && v['objectUrn'] !== undefined){

                               

                                if(v['profilePicture'] !== undefined && v['profilePicture'] !== null){

                                    if(
                                        v['profilePicture']['displayImageReference'] !== undefined &&
                                        v['profilePicture']['displayImageReference'] !== null &&
                                        v['profilePicture']['displayImageReference']['vectorImage'] !== undefined &&
                                        v['profilePicture']['displayImageReference']['vectorImage']['rootUrl'] !== undefined &&
                                        v['profilePicture']['displayImageReference']['vectorImage'] !== null &&
                                        v['profilePicture']['displayImageReference']['vectorImage']['rootUrl'] !== null &&
                                        v['profilePicture']['displayImageReference']['vectorImage']['artifacts'] !== undefined &&
                                        v['profilePicture']['displayImageReference']['vectorImage']['artifacts'][0] !== undefined &&
                                        v['profilePicture']['displayImageReference']['vectorImage']['artifacts'][0]['fileIdentifyingUrlPathSegment'] !== undefined
                                    ){
                                        userObject['user_profile_picture'] = v['profilePicture']['displayImageReference']['vectorImage']['rootUrl']+v['profilePicture']['displayImageReference']['vectorImage']['artifacts'][0]['fileIdentifyingUrlPathSegment'];
                                    }

                                }

                                userObject['user_first_name'] = SingleProfileSavingInterceptorcleanNameComma(v['firstName']);
                                userObject['user_last_name'] = SingleProfileSavingInterceptorcleanNameComma(v['lastName']);
                                userObject['user_url'] = 'https://linkedin.com/in/'+v['publicIdentifier'];
                                userObject['linkedin_id'] = SingleProfileSavingInterceptorextractIdNewLinkedin(v['objectUrn']);

                                if(v['headline'] !== undefined){
                                    userObject['job_title'] = v['headline'];
                                }

                            }

                            if(v['companyName'] !== undefined && v['*company'] !== undefined && v['title'] !== undefined){

                              

                                if(userObject['job_title'] === ''){

                                    getCompanyNameDom = $("#experience-section ul.pv-profile-section__section-info li.pv-profile-section__list-item:first-child").find('p.pv-entity__secondary-title').text();
                                    getCompanyNameDom = getCompanyNameDom.toLowerCase();
                                    getCompanyNameDom = getCompanyNameDom.replace(/(\r\n|\n|\r)/gm, "");
                                    getCompanyNameDom = getCompanyNameDom.trim();

                                    companyNameFromjson = v['companyName'].toLowerCase();

                                   

                                    if(companyNameFromjson.indexOf(getCompanyNameDom) !== -1){
                                
                                        userObject['job_title'] = SingleProfileSavingInterceptorUnescapeHtml(v['title'])
                                        userObject['user_company_name'] = SingleProfileSavingInterceptorcleanCompanyName(v['companyName']);
                                        userObject['user_company_id'] = SingleProfileSavingInterceptorextractIdNewLinkedinCompany(v['companyUrn']);

                                    }

                                }

                            }

                            if(v['firstName'] !== undefined && v['lastName'] !== undefined && v['publicIdentifier'] !== undefined && v['objectUrn'] !== undefined && v['geoLocation'] !== undefined){

                              
                                if(v['geoLocation']['*geo'] !== undefined){
                                    geoLocationId = v['geoLocation']['*geo'].replace('urn:li:fsd_geo:', '');
                                }

                            }


          

                        if(geoLocationId !== null){

                            ObjectProfile['included'].forEach(function(v) {

                                if(v['entityUrn'] !== undefined && v['entityUrn'] === 'urn:li:fsd_geo:'+geoLocationId){

                                    if(v['defaultLocalizedName'] !== undefined){

                                        userObject['user_city'] = v['defaultLocalizedName'];

                                    }

                                }

                            });

                        }

                        console.log('AB');

                        if((userObject['user_company_name'] === undefined) || (userObject['user_company_name'] !== undefined && userObject['user_company_name'].length <= 0)){

                            companyNameGet = $('#main ul.pvs-list li:first-child').find("a[data-field='experience_company_logo']:first-child span.t-bold span:first-child").text()

                            userObject['user_company_name'] = companyNameGet

                        }

                        companyIdLinkedinPremiumCurrent = $("body").find("a[data-field='experience_company_logo']:first-child").attr('href');

                        if(companyIdLinkedinPremiumCurrent !== undefined && companyIdLinkedinPremiumCurrent.length > 0){

                            if(companyIdLinkedinPremiumCurrent.indexOf('/company') !== -1){
                                companyIdLinkedinPremiumCurrent = companyIdLinkedinPremiumCurrent.replace('https://www.linkedin.com/company/','');
                                companyIdLinkedinPremiumCurrent = companyIdLinkedinPremiumCurrent.replace('https://linkedin.com/company/','');
                                companyIdLinkedinPremiumCurrent = companyIdLinkedinPremiumCurrent.replace('/','');
                                userObject['user_company_id'] = companyIdLinkedinPremiumCurrent;
                            }

                        }

                        console.log('BB');

                        console.log('LInkedin object')
                        console.log(userObject)
                       
                        runSingleProfileSavingEnrich(dataProfileBar,userObject)

                    
                }



                                
                                

			
            }
		});

    }

}

function runSingleProfileSavingEnrich(dataProfileBar,userObject){

                            SingleProfileEnriched = {};

                            dataProfileBar['profile'] = [{
                                        "type" : "head",
                                        "picture" : userObject['user_profile_picture'],
                                        "value" : userObject['user_first_name']+' '+userObject['user_last_name']
                                    },
                                    {
                                        "type" : "contact_data",
                                        "picture" : null,
                                        "value" : window.domainSetup+'/core/assets/publicIcons/at.svg',
                                        "row" : 1,
                                        "value_second" : "*******@****.***"
                                    },
                                    {
                                        "type" : "contact_data",
                                        "picture" : null,
                                        "value" : window.domainSetup+'/core/assets/publicIcons/at.svg',
                                        "row" : 2,
                                        "value_second" : "*******@****.***"
                                    },
                                    {
                                        "type" : "contact_data",
                                        "picture" : null,
                                        "value" : window.domainSetup+'/core/assets/publicIcons/phone.svg',
                                        "row" : 3,
                                        "value_second" : "+* *** ***"
                                    },
                                    {
                                        "type" : "contact_data",
                                        "picture" : null,
                                        "value" : window.domainSetup+'/core/assets/publicIcons/phone.svg',
                                        "row" : 4,
                                        "value_second" : "+* *** ***"
                                    }
                                    
                    ];

    	if(userObject['linkedin_id'] !== ''){

    
                    $.ajax({
                        type: "POST",
                        url: window.domainSetup +"/api-product/klm-save-monitoring-data-pulling-cache?token="+window.apiKeyTokenKLM87+'&token_2='+window.apiKeyTokenKLM88,
                        data: {companyId : userObject['user_company_id'] },
                        timeout: 6500000000,
                        async:false,
                        beforeSend: function(request) {
                            request.setRequestHeader("X-Product", "10");
                        },
						error: function(a, b) {

						},
						success: function(response) { 

                            response = JSON.parse(response);

                            if(response['has_cache'] === true || response['has_cache'] === 'empty'){

                                userObject['user_company_name'] = response['has_cache_data']['name'];
                                userObject['company_linkedin_url'] = response['has_cache_data']['linkedin_url'];
                                userObject['website'] = response['has_cache_data']['website'];
                                userObject['domain'] = response['has_cache_data']['domain'];
                                userObject['company_description'] = response['has_cache_data']['description'];
                                userObject['company_size'] = response['has_cache_data']['size_range_new'];
                                userObject['industry'] = response['has_cache_data']['industry_new'];
                                userObject['company_tags'] = response['has_cache_data']['tags'];
                                userObject['founded'] = response['has_cache_data']['year_found'];
                                userObject['company_headquarters'] = response['has_cache_data']['headquarters'];
                                userObject['type'] = response['has_cache_data']['type'];
                                userObject['company_profile_picture'] = response['has_cache_data']['picture'];

                                if(response['has_cache_data']['picture'] !== undefined && response['has_cache_data']['picture'].length > 0){

                                    pictureUrlCOmpany = response['has_cache_data']['picture'];

                                }else {

                                    pictureUrlCOmpany = window.domainSetup+'/core/assets/publicIcons/building-columns.svg';

                                }

                                console.log('A');

                                dataProfileBar['profile'].push({
                                            "type" : "head",
                                            "picture" : pictureUrlCOmpany,
                                            "title" : null,
                                            "value" : response['has_cache_data']['name']
                                });

                                if(userObject['domain'] !== undefined && userObject['domain'].length > 0){

                                    dataProfileBar['profile'][1]['value_second'] = '*****@'+userObject['domain'];
                                    dataProfileBar['profile'][2]['value_second'] = '*****@'+userObject['domain'];

                                    isEmptyValueCache = 'false';
                                    finalValuePush = userObject['domain'];
                                }else {
                                    isEmptyValueCache = 'true';
                                    finalValuePush = dataProfileBar['translate_minibar']['text_216'];
                                }

                                console.log('B');

                                dataProfileBar['profile'].push({
                                            "type" : "data",
                                            "picture" : window.domainSetup+'/core/assets/publicIcons/link.svg',
                                            "title" : dataProfileBar['translate_minibar']['text_217'],
                                            "value" : finalValuePush,
                                            "is_empty" : isEmptyValueCache,
                                            "has_link" : "true"
                                });

                                if(userObject['company_description'] !== undefined && userObject['company_description'].length > 0){
                                    isEmptyValueCache = 'false';
                                    finalValuePush = userObject['company_description'];
                                }else {
                                    isEmptyValueCache = 'true';
                                    finalValuePush = dataProfileBar['translate_minibar']['text_216'];
                                }

                                console.log('C');

                                dataProfileBar['profile'].push({
                                            "type" : "data",
                                            "picture" : window.domainSetup+'/core/assets/publicIcons/circle-info.svg',
                                            "title" : dataProfileBar['translate_minibar']['text_228'],
                                            "value" : finalValuePush,
                                            "is_empty" : isEmptyValueCache
                                });

                                if(userObject['company_size'] !== undefined && userObject['company_size'].length > 0){
                                    isEmptyValueCache = 'false';
                                    finalValuePush = userObject['company_size'];
                                }else {
                                    isEmptyValueCache = 'true';
                                    finalValuePush = dataProfileBar['translate_minibar']['text_216'];
                                    
                                }

                                console.log('D');

                                dataProfileBar['profile'].push({
                                            "type" : "data",
                                            "picture" : window.domainSetup+'/core/assets/publicIcons/people-carry-box.svg',
                                            "title" : dataProfileBar['translate_minibar']['text_219'],
                                            "value" : finalValuePush,
                                            "is_empty" : isEmptyValueCache
                                });

                                if(userObject['industry'] !== undefined && userObject['industry'].length > 0){
                                    isEmptyValueCache = 'false';
                                    finalValuePush = userObject['industry'];
                                }else {
                                    isEmptyValueCache = 'true';
                                    finalValuePush = dataProfileBar['translate_minibar']['text_216'];
                                }

                                dataProfileBar['profile'].push({
                                            "type" : "data",
                                            "picture" : window.domainSetup+'/core/assets/publicIcons/building-columns.svg',
                                            "title" : dataProfileBar['translate_minibar']['text_220'],
                                            "value" : finalValuePush,
                                            "is_empty" : isEmptyValueCache
                                });

                                console.log('E');

                                if(userObject['company_tags'] !== undefined && userObject['company_tags'].length > 0){
                                    isEmptyValueCache = 'false';
                                    finalValuePush = userObject['company_tags'];
                                }else {
                                    isEmptyValueCache = 'true';
                                    finalValuePush = dataProfileBar['translate_minibar']['text_216'];
                                }

                                dataProfileBar['profile'].push({
                                            "type" : "data",
                                            "picture" : window.domainSetup+'/core/assets/publicIcons/tags.svg',
                                            "title" : dataProfileBar['translate_minibar']['text_221'],
                                            "value" : finalValuePush,
                                            "is_empty" : isEmptyValueCache
                                });

                                console.log('F');

                                if(userObject['founded'] !== undefined && userObject['founded'].length > 0){
                                    isEmptyValueCache = 'false';
                                    finalValuePush = userObject['founded'];
                                }else {
                                    isEmptyValueCache = 'true';
                                    finalValuePush = dataProfileBar['translate_minibar']['text_216'];
                                }

                                dataProfileBar['profile'].push({
                                            "type" : "data",
                                            "picture" : window.domainSetup+'/core/assets/publicIcons/calendar-days.svg',
                                            "title" : dataProfileBar['translate_minibar']['text_224'],
                                            "value" : finalValuePush,
                                            "is_empty" : isEmptyValueCache
                                });

                                console.log('G');

                                if(userObject['company_headquarters'] !== undefined && userObject['company_headquarters'].length > 0){
                                    isEmptyValueCache = 'false';
                                    finalValuePush = userObject['company_headquarters'];
                                }else {
                                    isEmptyValueCache = 'true';
                                    finalValuePush = dataProfileBar['translate_minibar']['text_216'];
                                }

                                dataProfileBar['profile'].push({
                                            "type" : "data",
                                            "picture" : window.domainSetup+'/core/assets/publicIcons/map-location-dot.svg',
                                            "title" : dataProfileBar['translate_minibar']['text_222'],
                                            "value" : finalValuePush,
                                            "is_empty" : isEmptyValueCache
                                });

                                if(userObject['type'] !== undefined && userObject['type'].length > 0){
                                    isEmptyValueCache = 'false';
                                    finalValuePush = userObject['type'];
                                }else {
                                    isEmptyValueCache = 'true';
                                    finalValuePush = dataProfileBar['translate_minibar']['text_216'];
                                }

                                dataProfileBar['profile'].push({
                                            "type" : "data",
                                            "picture" : window.domainSetup+'/core/assets/publicIcons/building.svg',
                                            "title" : dataProfileBar['translate_minibar']['text_223'],
                                            "value" : finalValuePush,
                                            "is_empty" : isEmptyValueCache
                                });

                                KLMGetProfileInformationVoayager(userObject,dataProfileBar);
                                
                            }else {

                                $.ajax({
                                    type: "GET",
                                    url: "https://www.linkedin.com/voyager/api/entities/companies/"+userObject['user_company_id'],
                                    timeout: 60000,
                                    headers: {
                                        'csrf-token': KLMCurrentProfileGetCookie(),
                                    },
                                    error: function(a, b) {

                                        KLMGetProfileInformationVoayager(userObject,dataProfileBar);

                                    },
                                    success: function(response) { 

                                        console.log('COMPANIES INFO');
                                        console.log(response)

                                        $.each(response, function( k, v ) {
                                            hasMatchedKeyDataHeadCompany = false;

                                            valueData = dataProfileBar['translate_minibar']['text_216'];
                                            pictureIconUrl = '';

                                            console.log(k);

                                            if(k === 'basicCompanyInfo'){

                                                console.log('A1');
                                                
                                                pictureIconUrl = window.domainSetup+'/core/assets/publicIcons/building-columns.svg';      

                                                        

                                                if(
                                                    response[k]['miniCompany'] !== undefined &&
                                                    response[k]['miniCompany']['name'] !== undefined
                                                ){

                                                    valueData = response[k]['miniCompany']['name'];

                                                    userObject['user_company_name'] = valueData;

                                                    hasMatchedKeyDataHeadCompany = true;

                                                }

                                                console.log('A2');

                                                if(
                                                    response[k]['miniCompany'] !== undefined &&
                                                    response[k]['miniCompany']['universalName'] !== undefined
                                                ){
                                                    userObject['company_linkedin_url'] = 'https://linkedin.com/company/'+response[k]['miniCompany']['universalName'];
                                                }


                                                if(
                                                    response[k]['miniCompany'] !== undefined &&
                                                    response[k]['miniCompany']['logo'] !== undefined
                                                ){

                                                    logoObjectCompany = response[k]['miniCompany']['logo'];

                                                    
                                                    console.log('A3');

                                                    if(
                                                        logoObjectCompany['com.linkedin.common.VectorImage'] !== undefined &&
                                                        logoObjectCompany['com.linkedin.common.VectorImage']['artifacts'] &&
                                                        logoObjectCompany['com.linkedin.common.VectorImage']['artifacts'][0] &&
                                                        logoObjectCompany['com.linkedin.common.VectorImage']['artifacts'][0]['fileIdentifyingUrlPathSegment']
                                                    ){
                                                        
                                                        pictureIconUrl = logoObjectCompany['com.linkedin.common.VectorImage']['rootUrl']+logoObjectCompany['com.linkedin.common.VectorImage']['artifacts'][0]['fileIdentifyingUrlPathSegment'];

                                                        userObject['company_profile_picture'] = pictureIconUrl;
                                                
                                                    }

                                                }

                                            }

                                            if(hasMatchedKeyDataHeadCompany === true){

                                                if(dataProfileBar !== undefined && dataProfileBar['profile'] !== undefined){

                                                    dataProfileBar['profile'].push({
                                                            "type" : "head",
                                                            "picture" : pictureIconUrl,
                                                            "title" : null,
                                                            "value" : valueData
                                                    });

                                                }

                                            }
                                        });

                                        console.log('A4')

                                        hasMatchedCompanyDomain = false;
                                        hasMatchedCompanyDomainValue = '';

                                        $.each(response, function( k, v ) {

                                            hasMatchedKeyData = false;

                                            pictureIconUrl = '';
                                            valueDataTitle = '';
                                            valueData = dataProfileBar['translate_minibar']['text_216'];
                                            has_link = 'false';

                                            console.log(k);


                                            if(k === 'websiteUrl'){

                                                valueData = response['websiteUrl'].toLowerCase();

                                                userObject['website'] = valueData;

                                                valueData = valueData.replace('https:://','https://');

                                                if(valueData.length > 0){

                                                    console.log('VALUE: '+valueData)

                                                    if(valueData.indexOf('www.') !== -1){

                                                        valueData = valueData.replace('www.','');

                                                    }

                                                    // let domainUser = (new URL(valueData));

                                                    // valueData = domainUser.hostname.replace('www.','');

                                                }

                                                valueData = valueData.replace('https://www.','');
                                                valueData = valueData.replace('https://','');
                                                valueData = valueData.replace('http://www.','');
                                                valueData = valueData.replace('http://','');
                                                valueData = valueData.replace('/','');

                                                valueData = psl.parse(valueData);
                                                valueData = valueData.domain;

                                                

                                                console.log(valueData);

                                                userObject['domain'] = valueData;

                                                hasMatchedCompanyDomain = true;
                                                hasMatchedCompanyDomainValue = valueData;

                                                pictureIconUrl = window.domainSetup+'/core/assets/publicIcons/link.svg';

                                                valueDataTitle = dataProfileBar['translate_minibar']['text_217'];

                                                has_link = 'true';

                                                hasMatchedKeyData = true;

                                            }

                                            if(k === 'description'){

                                                valueData = response[k];
                                                
                                                pictureIconUrl = window.domainSetup+'/core/assets/publicIcons/circle-info.svg';

                                                valueDataTitle = dataProfileBar['translate_minibar']['text_218'];

                                                userObject['company_description'] = valueData;

                                                hasMatchedKeyData = true;

                                            }

                                            if(k === 'employeeCountRange'){

                                                valueData = response[k];

                                                console.log(valueData)
                                                
                                                pictureIconUrl = window.domainSetup+'/core/assets/publicIcons/people-carry-box.svg';

                                                valueDataTitle = dataProfileBar['translate_minibar']['text_219'];

                                                userObject['company_size'] = valueData;

                                                hasMatchedKeyData = true;

                                            }

                                            if(k === 'industries'){

                                                valueData = response[k];

                                                

                                                if(valueData.length > 0){

                                                    valueData = valueData.join(', ');

                                                }

                                                userObject['industry'] = valueData;

                                                pictureIconUrl = window.domainSetup+'/core/assets/publicIcons/building-columns.svg';

                                                valueDataTitle = dataProfileBar['translate_minibar']['text_220'];

                                                hasMatchedKeyData = true;

                                            }

                                            if(k === 'specialities'){

                                                valueData = response[k];

                                                if(valueData.length > 0){

                                                    valueData = valueData.join(', ');

                                                }else {

                                                    valueData = dataProfileBar['translate_minibar']['text_216'];

                                                }

                                                userObject['company_tags'] = valueData;
                                                
                                                pictureIconUrl = window.domainSetup+'/core/assets/publicIcons/tags.svg';

                                                valueDataTitle = dataProfileBar['translate_minibar']['text_221'];

                                                hasMatchedKeyData = true;

                                            }

                                            if(k === 'foundedDate'){

                                                valueData = '';

                                                if(response[k]['year'] !== undefined){
                                                    valueData = response[k]['year'];
                                                }

                                                userObject['founded'] = valueData;
                                                
                                                pictureIconUrl = window.domainSetup+'/core/assets/publicIcons/calendar-days.svg';

                                                valueDataTitle = dataProfileBar['translate_minibar']['text_224'];

                                                hasMatchedKeyData = true;

                                            }

                                            if(k === 'basicCompanyInfo'){

                                                valueData = '';

                                                if(response[k]['headquarters'] !== undefined){
                                                    valueData = response[k]['headquarters'];
                                                }

                                                userObject['company_headquarters'] = valueData;
                                                
                                                pictureIconUrl = window.domainSetup+'/core/assets/publicIcons/map-location-dot.svg';

                                                valueDataTitle = dataProfileBar['translate_minibar']['text_222'];

                                                hasMatchedKeyData = true;

                                            }

                                            if(k === 'companyType'){

                                                valueData = response[k];
                                                
                                                pictureIconUrl = window.domainSetup+'/core/assets/publicIcons/building.svg';

                                                valueDataTitle = dataProfileBar['translate_minibar']['text_223'];

                                                userObject['type'] = valueData;

                                                hasMatchedKeyData = true;

                                            }

                                            if(hasMatchedKeyData === true){

                                                if(valueData.length === 0){

                                                    isEmptyValue = 'true';

                                                }else {

                                                    isEmptyValue = 'false';
                                                }

                                                dataProfileBar['profile'].push({
                                                        "type" : "data",
                                                        "picture" : pictureIconUrl,
                                                        "title" : valueDataTitle,
                                                        "value" : valueData,
                                                        "is_empty" : isEmptyValue,
                                                        "has_link" : has_link
                                                });

                                            }

                                        });

                                        KLMGetProfileInformationVoayager(userObject,dataProfileBar);

                                    }

                                });

                            }


                        }
                    });

	    }

}


function KLMGetProfileInformationVoayager(userObject,dataProfileBar){

            if(userObject['domain'].length > 0){

                    dataProfileBar['profile'][1]['value_second'] = '*****@'+userObject['domain'];
                    dataProfileBar['profile'][2]['value_second'] = '*****@'+userObject['domain'];

            }

            $.ajax({
                    type: "POST",
                    url: window.domainSetup +"/api-product/klm-save-monitoring-data-pulling-cache-profile?token="+window.apiKeyTokenKLM87+'&token_2='+window.apiKeyTokenKLM88,
                    data: {userObject : userObject, currentUser : window.KLM_user_profile.email},
                    timeout: 6500000000,
                    async:false,
                    beforeSend: function(request) {
                        request.setRequestHeader("X-Product", "10");
                    },
					error: function(a, b) {

					},
					success: function(response) { 

                        response = JSON.parse(response);

                        if(response['has_cache'] === true){

                            console.log('HAS CACHE VOYAGER')

                            if(response['email_first'].length > 0){
                                  userObject['email_first'] = response['email_first'];
                            }
                            if(response['email_second'].length > 0){
                                  userObject['email_second'] = response['email_second'];
                            }
                            if(response['phone'].length > 0){
                                  userObject['phone'] = response['phone'];
                            }

                            if(response['company_phone'].length > 0){
                                  userObject['company_phone'] = response['company_phone'];
                            }

                            KlmSaveSingleProfileBarInformationCache(dataProfileBar,userObject,'true')

                        }else {

                            if(userObject['user_url'].indexOf('/in/') !== -1){
                                linkedInProfileIdUrl = userObject['user_url'].split('/in/');
                                linkedInProfileIdUrl = linkedInProfileIdUrl[1];
                            }

                            $.ajax({
                                        type: "GET",
                                        url: "https://www.linkedin.com/voyager/api/identity/profiles/"+linkedInProfileIdUrl+"/profileContactInfo",
                                        timeout: 60000,
                                        headers: {
                                            'csrf-token': KLMCurrentProfileGetCookie(),
                                        },
                                        error: function(a, b) {

                                            KlmSaveSingleProfileBarInformationCache(dataProfileBar,userObject,'false')

                                        },
                                        success: function(response) { 

                                            console.log('DATA SINGLE NO CACHE');
                                            console.log(response)

                                            if(response['emailAddress'] !== undefined){
                                                if(response['emailAddress'].length > 0){
                                                    userObject['email_first'] = response['emailAddress'];
                                                }
                                            }

                                            if(response['phoneNumbers'] !== undefined){
                                                if(response['phoneNumbers'].length > 0){

                                                    objectNumber = response['phoneNumbers'][0];

                                                    userObject['phone'] = objectNumber['number'];
                                                }
                                            }

                                            KlmSaveSingleProfileBarInformationCache(dataProfileBar,userObject,'false')

                                        }
                            });

                        }

                        console.log('finished checked cache profile')

                    }
            });

}

function KlmSaveSingleProfileBarInformationCache(dataProfileBar,userObject,isCache){

    window.KLMUserObject = userObject;

    currentListView = $("#KLM__profile__bar__single__saving").val();

    campaignSource = null;
    campaignEmail = null;

    if($('#KLM__profile__bar__single__saving__campaigns').length > 0){
        campaignSource = $("#KLM__profile__bar__single__saving__campaigns").val();
    }

    if($('#KLMGlobalSingleBarPushToCampaignSelectEmails').length > 0){
        campaignEmail = $("#KLMGlobalSingleBarPushToCampaignSelectEmails").val();
    }


    $.ajax({
                    type: "POST",
                    url: window.domainSetup +"/api-product/klm-save-monitoring-data-pulling-cache-profile-refresh?token="+window.apiKeyTokenKLM87+'&token_2='+window.apiKeyTokenKLM88,
                    data: {userObject : userObject, currentUser : window.KLM_user_profile.email, isCache : isCache, currentListView : currentListView, campaignSource : campaignSource, campaignEmail : campaignEmail},
                    timeout: 6500000000,
                    async:false,
                    beforeSend: function(request) {
                        request.setRequestHeader("X-Product", "10");
                    },
					error: function(a, b) {

					},
					success: function(response) { 

                            response = JSON.parse(response);

                            console.log('LINKEDIN ID: '+userObject['linkedin_id']);

                            dataProfileBar['has_unlocked'] = response['has_unlocked'];
                            dataProfileBar['is_saved_global'] = response['is_saved_global'];

                            if(response['is_saved_global'] === 'true'){
                                $('.KLM__bar__information__saved__list').show();
                            }else {
                                $('.KLM__bar__information__saved__list').hide();
                            }

                            dataProfileBar['is_saved_global_count'] = response['is_saved_global_count'];

                            $('.KLM__bar__information__saved__list__count').html(response['is_saved_global_count']);
                            
                            dataProfileBar['is_saved_current_list'] = response['is_saved_list'];
                            
                            if(dataProfileBar['is_saved_current_list'] === 'true'){
                                $('.KLMGlobalSingleBarSaveProfilChecked').show();
                                $('#KLMGlobalSingleBarSaveProfil').hide();
                            }else {
                                $('.KLMGlobalSingleBarSaveProfilChecked').hide();
                            }

                            // is in campaign

                            if(response['is_saved_list'] === 'true'){

                                $('.KLMSaveCampaignSingleBarEvent_1').hide();
                                $('.KLMSaveCampaignSingleBarEvent_2').show();

                            }

                            if(response['is_in_campaign'] === 'true'){

                                $('.KLMGlobalSingleBarSaveProfilAndCampaignActionExist').show();
                                $('.KLMGlobalSingleBarSaveProfilAndCampaignAction').hide();

                            }else {

                                $('.KLMGlobalSingleBarSaveProfilAndCampaignActionExist').hide();

                                if(response['is_saved_list'] === 'true'){

                                    $('.KLMGlobalSingleBarSaveProfilAndCampaignAction').show();

                                }

                            }

                            // is in campaign

                            $('.KLM_extensionSingleProfileViewWrapperBlockBindExchangeLoader').hide();

                            var template = Handlebars.templates.single_profile_view;
                            var context = dataProfileBar;                
                            var html = template(context);
                            $(".KLM_extensionSingleProfileViewWrapperBlockBindExchange").html(html);

  

                            if(response['is_saved_list'] === 'true'){
                                $('#KLMGlobalSingleBarSaveProfil').hide();
                            }else {

                                if(response['has_unlocked'] === 'true'){

                                    $('#KLMGlobalSingleBarSaveProfil').show();
                                   

                                }
                            
                            }

                            window.KLMCheckingSingleProfileProcessFinished = true;
                            window.KLMCheckingSingleProfileAutorised = false;

                            response['auto_unlock'] = true;

                            KLMRunUnlockBarState(response);

                    }

    });

}

function KLMAutoUnlockClusterSingleProfile(response){

    $.ajax({
                        type: "POST",
                        url: window.domainSetup +"/api-product/unlock-profile-information?auto_unlock=ok&token="+window.apiKeyTokenKLM87+'&token_2='+window.apiKeyTokenKLM88,
                        data: {userObject : window.KLMUserObject},
                        timeout: 6500000000,
                        beforeSend: function(request) {
                              request.setRequestHeader("X-Product", "10");
                        },
                        async:false,
                        error: function(a, b) {
                        },
                        success: function(a) {     

                                var response = $.parseJSON(a)

                        }

    });

}

function KLMRunUnlockBarState(response){

    if(response['state'] == true){

                            if(response['email_first'].length === 0 && response['email_second'].length === 0 && response['phone'].length === 0 && response['company_phone'].length === 0){


                                    if(response['has_unlocked'] === 'true'){

                                        $('.KLMWarningNoDataUnlockProfileInformation').show();


                                        $('.KLM_extensionSingleProfileViewWrapperBlockSingleRowDataContentContactData_1').closest('.KLM_extensionSingleProfileViewWrapperBlockSingleRow').hide();
                                        $('.KLM_extensionSingleProfileViewWrapperBlockSingleRowDataContentContactData_2').closest('.KLM_extensionSingleProfileViewWrapperBlockSingleRow').hide();
                                        $('.KLM_extensionSingleProfileViewWrapperBlockSingleRowDataContentContactData_3').closest('.KLM_extensionSingleProfileViewWrapperBlockSingleRow').hide();
                                        $('.KLM_extensionSingleProfileViewWrapperBlockSingleRowDataContentContactData_4').closest('.KLM_extensionSingleProfileViewWrapperBlockSingleRow').hide();

                                        $('.KLMGlobalSingleBarSaveProfil,.KLMUnlockLoaderWrapper,#KLMGlobalSingleBarSaveProfil').hide();
                                        
                                    }else {

                                        if(response['has_unlocked'] === 'false'){

                                            $('.KLMGlobalSingleBarSaveProfilChecked, .KLM__bar__information__saved__list').hide();

                                            

                                        }

                                    }


                                    $('#KLMGlobalSingleBarPushToCampaign').hide();

                                 }else {

                                     $("#KLMGlobalSingleBarPushToCampaignSelectEmails").html('');

                                    if(response['email_first'].length > 0){
                                        $('.KLM_extensionSingleProfileViewWrapperBlockSingleRowDataContentContactData_1').html(response['email_first'])

                                        $('#KLMGlobalSingleBarPushToCampaign').show();

                                        window.KLMUserObject['email_first'] = response['email_first']

                                        $('#KLMGlobalSingleBarPushToCampaignSelectEmails').append('<option value="'+response['email_first']+'">'+response['email_first']+'</option>');

                                    }else {
                                        $('.KLM_extensionSingleProfileViewWrapperBlockSingleRowDataContentContactData_1').closest('.KLM_extensionSingleProfileViewWrapperBlockSingleRow').hide();
                                    }

                                    if(response['email_second'].length > 0){
                                        $('.KLM_extensionSingleProfileViewWrapperBlockSingleRowDataContentContactData_2').html(response['email_second'])

                                        $('#KLMGlobalSingleBarPushToCampaign').show();
                                        window.KLMUserObject['email_second'] = response['email_second']

                                        $('#KLMGlobalSingleBarPushToCampaignSelectEmails').append('<option value="'+response['email_second']+'">'+response['email_second']+'</option>');

                                    }else {
                                        $('.KLM_extensionSingleProfileViewWrapperBlockSingleRowDataContentContactData_2').closest('.KLM_extensionSingleProfileViewWrapperBlockSingleRow').hide();
                                        
                                    }

                                    if(response['phone'].length > 0){
                                        $('.KLM_extensionSingleProfileViewWrapperBlockSingleRowDataContentContactData_3').html(response['phone'])
                                        window.KLMUserObject['phone'] = response['phone']
                                    }else {
                                        $('.KLM_extensionSingleProfileViewWrapperBlockSingleRowDataContentContactData_3').closest('.KLM_extensionSingleProfileViewWrapperBlockSingleRow').hide();
                                    }

                                    if(response['company_phone'].length > 0){
                                        $('.KLM_extensionSingleProfileViewWrapperBlockSingleRowDataContentContactData_4').html(response['company_phone'])
                                        window.KLMUserObject['company_phone'] = response['company_phone']
                                    }else {
                                        $('.KLM_extensionSingleProfileViewWrapperBlockSingleRowDataContentContactData_4').closest('.KLM_extensionSingleProfileViewWrapperBlockSingleRow').hide();
                                    }

                                     $('.KLMWarningNoDataUnlockProfileInformation,.KLMUnlockLoaderWrapper').hide();

                                     // manage campaigns if data

                                     if(response['email_first'].length > 0 && response['email_second'].length > 0){

                                        $('.KLMGlobalSingleBarPushToCampaignSelectEmailsWrapper').show();

                                     }

                                 }

                                 }else if(response['state'] === 'trial_limit'){

                                     $('#KLMUnlockProfileInformation,.KLMWarningNoCreditsUnlockProfileInformation').show();
                                     $('.KLMUnlockLoaderWrapper').hide();

                                 }

                                 KLMAutoUnlockClusterSingleProfile(response);
                                 

}

function KLMCurrentProfileGetCookie() {
    var name = 'JSESSIONID' + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {

        c = c.substring(name.length, c.length);
        c = c.replace('"','')
        c = c.replace('"','')

        return c;
      }
    }
    return "";
}

function KLMGlobalSingleBarSaveProfilAndCampaignAction(){

    SingleProfileEnriched = {};
    SingleProfileEnriched[window.KLMUserObject['linkedin_id']] = window.KLMUserObject;
    SingleProfileEnriched['manual_campaign_push'] = 'true';
    runSavingSingleProfileLinkedin(SingleProfileEnriched);

}

function runSavingSingleProfileLinkedin(data){

    if($("#KLMGlobalSingleBarPushToCampaignCheck").is(':checked')){
        campaignTrigger = 'true';
    }else {
        campaignTrigger = 'false';
    }

    campaignSource = $('#KLM__profile__bar__single__saving__campaigns').val();

    campaignEmail = $("#KLMGlobalSingleBarPushToCampaignSelectEmails").val();

    extraApiCampaign = '';

    if(data['manual_campaign_push'] !== undefined){
        if(data['manual_campaign_push'] === 'true'){
            extraApiCampaign = '&only_campaign=true';
            campaignTrigger = 'true';
        }
        delete data["manual_campaign_push"]; 
    }

    if(campaignEmail.length === 0){
        campaignTrigger = 'false';
    }

	$.ajax({
		type: "POST",
		url: "https://myapiconnect.com/api-product/post-save-contacts?special_bar=true&manifest_version=3&token="+window.apiKeyTokenKLM87+'&token_2='+window.apiKeyTokenKLM88+extraApiCampaign,
		data: {json : JSON.stringify(data), list_id : $("#KLM__profile__bar__single__saving").val(), campaignTrigger : campaignTrigger, campaignSource : campaignSource, campaignEmail : campaignEmail  },
		timeout: 6500000000,
		beforeSend: function(request) {
			request.setRequestHeader("X-Product", "10");
		},
		async:false,
		error: function(a, b) {
				
		},
		success: function(a) {     

			var response = $.parseJSON(a)

			if(response['state'] == true){

                $(".KLMGlobalSingleBarSaveProfilChecked").show();
                $('.bindKLMLoaderSaveProfile').hide();

                if(campaignTrigger === 'true'){

                    $('.KLMSaveCampaignSingleBarEvent_1').hide();
                    $('.KLMSaveCampaignSingleBarEvent_2').show();
                    $('.KLMGlobalSingleBarSaveProfilAndCampaignActionExist').show();

                }

			}else if(response['state'] === 'trial_limit'){

                $('.KLMWarningNoCreditsUnlockProfileInformation').show();
                $("#KLMGlobalSingleBarSaveProfil").show();

             }

		}

	});

}

function SingleProfileSavingInterceptorextractIdNewLinkedinCompany(str){

	extract_id = str.replace("urn:li:fs_salesCompany:", "");
    extract_id = extract_id.replace("urn:li:fsd_company:", "");
	return extract_id;

}

function SingleProfileSavingInterceptorcleanCompanyName(string){
	
		string = string.replace(', Inc.', '')
        string = string.replace(', Inc', '')
		string = string.replace(' Inc.', '')
		string = string.replace(' Inc', '')
		string = string.replace(' LLC', '')
		string = string.replace(', LLC', '')
		string = string.trim();
		string = string.replace('<b>', '');
		string = string.replace('</b>', '');
	
		string = string.replace('&lt;b&gt;', '');
		string = string.replace('&lt;/b&gt;', '');

		string = string.replace(', INC.', '');

		return string;

}

function SingleProfileSavingInterceptorextractIdNewLinkedin(str){

	extract_id = str.replace("urn:li:member:", "");

	return extract_id;

}

function SingleProfileSavingInterceptorcleanName(string){

	string2 = string.SingleProfileSavingInterceptorReplaceAllX('- ', '').toString();

	string3 = string2.toString().replace('.', '');
	string3 = string3.toString().replace('. ', '');

	words_name = string3.split(" ");

	names__array = [];

	names__array.push(words_name[0]);

	if(words_name[2] != undefined && words_name[3] != undefined){
	names__array.push(words_name[1]+"-"+words_name[2]+"-"+words_name[3]);
	}else if(words_name[2] != undefined) {
	names__array.push(words_name[1]+"-"+words_name[2]);
	}else {
	names__array.push(words_name[1]);       
	}

	return names__array;

}


String.prototype.SingleProfileSavingInterceptorReplaceAllX = function(search, replacement) {
var target = this;
return target.replace(new RegExp(search, 'g'), replacement);
};

function SingleProfileSavingInterceptorcleanNameComma(string){

	if(string === undefined){
	    return '';
	}

	if(string.indexOf(',') > -1){

        string = string.split(',');
        string = string[0]

    }

    return string;

}

function SingleProfileSavingInterceptorUnescapeHtml(safe) {

	var tmp = document.createElement("DIV");
	tmp.innerHTML = safe;
	vrs =  tmp.textContent || tmp.innerText || "";
	vrs = vrs.replace(/<(?:.|\n)*?>/gm, '')
	return vrs;
}

function SingleProfileSavingInterceptorCompanyPremium(string){

	companyName = '';

	if(string.indexOf('at ') !== -1){
	string = string.split('at ');
	companyName = string[1];
	}

	if(string.indexOf('chez ') !== -1){
	string = string.split('chez ');
	companyName = string[1];
	}

	if(string.indexOf('en ') !== -1){
	string = string.split('en ');
	companyName = string[1];
	}

	if(companyName.indexOf('- ') !== -1){
	companyName = companyName.split('- ');
	companyName = companyName[0];
	}

	if(companyName.indexOf('| ') !== -1){
	companyName = companyName.split('| ');
	companyName = companyName[0];
	}

	companyName = companyName.trim();

	return companyName;

}

// const script = document.createElement('script')
// script.src = chrome.runtime.getURL('xhr_inject.js')
// script.type = 'text/javascript';
// (document.head || document.body || document.documentElement).appendChild(script);


// let targets = [
//     "www.linkedin.com/sales-api/salesApiProfiles",
//     "www.linkedin.com/sales/profile/",
//     "www.linkedin.com/connected/api/v1/contacts",
// 	"www.linkedin.com/sales-api/salesApiPeopleSearch",
// 	"www.linkedin.com/sales-api/salesApiLeadSearch",
//     "www.linkedin.com/connected/api/v2/contacts",
//     "www.linkedin.com/sales-api/salesApiMessagingThreads",
//     "www.linkedin.com/communities-api/v1/memberships/community",
//     "www.linkedin.com/sales/search/results",
//     "www.linkedin.com/voyager/api/",
//     "www.linkedin.com/recruiter/api/smartsearch",
//     "www.linkedin.com/sales-api/salesApiMailbox"
// ];

// try {
//     let OldFetch = window.fetch;
//     window.fetch = function () {
//         return new Promise((resolve, reject) => {
//             OldFetch.apply(this, arguments).then(async (response) => {
//                 if (response.ok) {
//                     let res = response.clone();
//                     res.text().then(t => handleRequests(res, t)).catch(e => { });
//                 }
//                 resolve(response);
//             }).catch((error) => reject())
//         });
//     }
// } catch (error) {

// }
// async function handleRequests(response, res) {
//     var resp = {};
//     try {
//         resp.data = res;
//         resp.type = response.type;
//         resp.url = response.url;
//         if (typeof resp.url != "undefined" && targets.filter(target => resp.url.indexOf(target) > -1).length > 0) {
            
//             if(
// 				resp.url.indexOf('salesApiPeopleSearch') !== -1 ||
// 				resp.url.indexOf('salesApiLeadSearch') !== -1
// 			){

// 				jsonProfiles = JSON.parse(resp.data);

// 				console.log(jsonProfiles)

// 				///
// 					allProfiles = {};

// 					if(jsonProfiles['elements'] !== undefined){

// 						// $.each(jsonProfiles['elements'], function( k, v ) {

// 						jsonProfiles['elements'].forEach(function(v) {

// 							// console.log(v);

// 							userObject = {};
// 							userObject['company_size'] = '';
// 							userObject['domain'] = '';
// 							userObject['founded'] = '';
// 							userObject['industry'] = '';
// 							userObject['job_title'] = '';
// 							userObject['linkedin_id'] = '';
// 							userObject['past_company'] = '';
// 							userObject['rewards'] = '';
// 							userObject['skills'] = '';
// 							userObject['type'] = '';
// 							userObject['user__summary__experience'] = '';
// 							userObject['user_city'] = '';
// 							userObject['user_company_id'] = '';
// 							userObject['user_company_name'] = '';
// 							userObject['user_first_name'] = '';
// 							userObject['user_keywords'] = '';
// 							userObject['user_last_name'] = '';
// 							userObject['user_number_connections'] = '';
// 							userObject['user_other_email'] = '';
// 							userObject['user_profile_picture'] = '';
// 							userObject['user_source'] = 'linkedin';
// 							userObject['user_summary'] = '';
// 							userObject['user_url'] = '';
// 							userObject['vcard'] = '';
// 							userObject['website'] = '';

// 							if(v['currentPositions'] !== undefined && v['currentPositions']['companyName'] !== undefined){
// 								userObject['user_company_name'] = InterceptorcleanCompanyName(v['currentPositions']['companyName']);
// 							}

// 							if(v['currentPositions'] !== undefined && v['currentPositions']['companyUrn'] !== undefined){
// 								userObject['user_company_id'] = InterceptorextractIdNewLinkedinCompany(v['currentPositions']['companyUrn']);
// 							}

// 							if(v['geoRegion'] !== undefined && v['geoRegion'] !== undefined){
// 								userObject['user_city'] = v['geoRegion'];
// 							}

// 							if(v['currentPositions'] !== undefined && v['currentPositions']['title'] !== undefined){
// 								userObject['job_title'] = InterceptorUnescapeHtml(v['currentPositions']['title']);
// 							}

// 							if(v['firstName'] !== undefined){
// 								userObject['user_first_name'] = InterceptorcleanNameComma(v['firstName']);
// 							}

// 							if(v['lastName'] !== undefined){
// 								userObject['user_last_name'] = InterceptorcleanNameComma(v['lastName']);
// 							}

// 							if(v['objectUrn'] !== undefined){
// 								userObject['linkedin_id'] = InterceptorextractIdNewLinkedin(v['objectUrn']);
// 							}
							
// 							if(v['currentPositions'] !== undefined && v['currentPositions']['companyName'] !== undefined){
// 								companyNameSearch = v['currentPositions']['companyName'];
// 							}else {
// 								companyNameSearch = '';
// 							}

// 							if(v['currentPositions'] !== undefined && v['currentPositions'].length > 0){


// 												for (var index = 0; index < v['currentPositions'].length; index++) {
// 													var element = v['currentPositions'][index];

// 													if(element['current'] !== undefined && element['current'] === true){

// 														if(element['title'] !== undefined){

// 															userObject['job_title'] = InterceptorUnescapeHtml(element['title']);
														

// 														}

// 														if(element['companyName'] !== undefined){

// 															userObject['user_company_name'] = InterceptorcleanCompanyName(element['companyName']);
// 															companyNameSearch = element['companyName'];

// 														}

// 														if(element['companyUrn'] !== undefined){

// 															userObject['user_company_id'] = InterceptorextractIdNewLinkedinCompany(element['companyUrn']);

// 														}

// 													}
													
// 												}

// 							}

// 							if(v['entityUrn'] !== undefined){
// 								userObject['user_url'] = v['entityUrn'].toString().replace('urn:li:fs_salesProfile:(', 'https://www.linkedin.com/sales/people/')
// 								userObject['user_url'] = userObject['user_url'].replace(',ibn_)', '');
// 								userObject['user_url'] = userObject['user_url'].replace(')', '');

// 							}

// 							if(userObject['linkedin_id'] !== ''){
// 								allProfiles[userObject['linkedin_id']] = userObject;
// 							}

// 							console.log(userObject);

// 						});



// 						localStorage.setItem("INTERCEPTOR3837383", JSON.stringify(allProfiles));



// 					}
				
// 				///


//             }
            
//             let resevent = new CustomEvent("datachannel", {
//                 detail: resp
//             });
//             //document.dispatchEvent(resevent)
//         }
//     } catch (e) { }
// }



// String.prototype.InterceptorReplaceAllX = function(search, replacement) {
// 	var target = this;
// 	return target.replace(new RegExp(search, 'g'), replacement);
// 	};
	
	
	
	
	
	
	
// 	function isNumeric(num){
// 	return !isNaN(num)
// 	}
	
// 	function InterceptorcleanName(string){
	
// 		string2 = string.InterceptorReplaceAllX('- ', '').toString();
	
// 		string3 = string2.toString().replace('.', '');
// 		string3 = string3.toString().replace('. ', '');
	
// 		words_name = string3.split(" ");
	
// 		names__array = [];
	
// 		names__array.push(words_name[0]);
	
// 		if(words_name[2] != undefined && words_name[3] != undefined){
// 		names__array.push(words_name[1]+"-"+words_name[2]+"-"+words_name[3]);
// 		}else if(words_name[2] != undefined) {
// 		names__array.push(words_name[1]+"-"+words_name[2]);
// 		}else {
// 		names__array.push(words_name[1]);       
// 		}
	
// 		return names__array;
	
// 	}
	
// 	function InterceptorcleanCompanyName(string){
		
// 			string = string.replace(', Inc.', '')
// 			string = string.replace(' Inc.', '')
// 			string = string.replace(' Inc', '')
// 			string = string.replace(' LLC', '')
// 			string = string.replace(', LLC', '')
// 			string = string.trim();
// 			string = string.replace('<b>', '');
// 			string = string.replace('</b>', '');
		
// 			string = string.replace('&lt;b&gt;', '');
// 			string = string.replace('&lt;/b&gt;', '');
	
// 			string = string.replace(', INC.', '');
	
// 			return string;
	
// 	}
	
// 	function InterceptorCompanyPremium(string){
	
// 		companyName = '';
	
// 		if(string.indexOf('at ') !== -1){
// 		string = string.split('at ');
// 		companyName = string[1];
// 		}
	
// 		if(string.indexOf('chez ') !== -1){
// 		string = string.split('chez ');
// 		companyName = string[1];
// 		}
	
// 		if(string.indexOf('en ') !== -1){
// 		string = string.split('en ');
// 		companyName = string[1];
// 		}
	
// 		if(companyName.indexOf('- ') !== -1){
// 		companyName = companyName.split('- ');
// 		companyName = companyName[0];
// 		}
	
// 		if(companyName.indexOf('| ') !== -1){
// 		companyName = companyName.split('| ');
// 		companyName = companyName[0];
// 		}
	
// 		companyName = companyName.trim();
	
// 		return companyName;
	
// 	}
	
// 	function InterceptorextractIdNewLinkedinCompany(str){
	
// 		extract_id = str.replace("urn:li:fs_salesCompany:", "");
	
// 		return extract_id;
	
// 	}
	
// 	function InterceptorextractIdNewLinkedin(str){
	
// 		extract_id = str.replace("urn:li:member:", "");
	
// 		return extract_id;
	
// 	}
	
// 	function InterceptorUnescapeHtml(safe) {
	
// 	var tmp = document.createElement("DIV");
// 	tmp.innerHTML = safe;
// 	vrs =  tmp.textContent || tmp.innerText || "";
// 	vrs = vrs.replace(/<(?:.|\n)*?>/gm, '')
// 	return vrs;
// 	}
	
	
// 	function InterceptorcleanNameComma(string){
	
// 		if(string === undefined){
// 		return '';
// 		}
	
// 		if(string.indexOf(',') > -1){
	
// 		string = string.split(',');
// 		string = string[0]
	
// 	}
	
// 	return string;
	
// 	}
	


$.ajax({
    type: "GET",
    url: "https://myapiconnect.com/api-product/multi-loader-extension-manifest-v3?token="+window.apiKeyTokenKLM87+'&token_2='+window.apiKeyTokenKLM88,
    beforeSend: function(request) {
        request.setRequestHeader("X-Product", "10");
    },
    timeout: 86400,
    error: function(a, b) {
        
    },
    success: function(a) {     

        var response = $.parseJSON(a)

        if(response['state'] == true){

            window.objectPkrPreFill = JSON.parse(response['messagesPrefillData']);
    
            if(window.objectPkrPreFill.length > 0){

                $.each(window.objectPkrPreFill, function( k, v ) {

                    bindEvent = v['shortcut_keyboard_1']+'+'+v['shortcut_keyboard_2'];

                    $(document).bind('keydown', bindEvent, function(event){

                        $('.bind38337373737').hide();

                        $('.bind38337373737').css('background-color', '#'+v['color']);

                        $('.bind38337373737').html(v['title']+'<br>'+v['message']);
                        $('.bind38337373737').fadeIn(200);
                        setTimeout(function() {

                            $('.bind38337373737').fadeOut(200,function(){
                                $('.bind38337373737').html('')
                            });

                        }, 2000);

                        pKrPrefillcopyToClipboardPrefill(v['message']);

                    });

                });

                $("body").append('<div class="bind38337373737" style="max-width:300px;font-size:13px!important;white-space: pre-wrap!important;z-index:999999999;display:none;position:fixed!important;bottom:20px!important;left:20px!important;padding:10px!important;border-radius:5px!important;color:#fff!important;background-color:#ddd!important;"></div>')

            }

        }
    }
});

function pKrPrefillcopyToClipboardPrefill(content) {

	$('.copyClipBoardInputTemp').remove();
    var $temp = $("<textarea tabindex='-1' aria-hidden='true' class='copyClipBoardInputTemp'>");
    $("body").append($temp);
    $temp.val(content).select();

    document.execCommand("copy");
    $temp.remove();

}


if( window.location.href.indexOf("linkedin.com") === -1 ){


window.KLM_918_contacts_scraper_current_domain = window.location.host;

if(window.KLM_918_contacts_scraper_current_domain.indexOf('www.') !== -1){

	window.KLM_918_contacts_scraper_current_domain = window.KLM_918_contacts_scraper_current_domain.replace('www.', '');

}

if(window.KLM_918_contacts_scraper_current_domain.indexOf('https://') !== -1){

	window.KLM_918_contacts_scraper_current_domain = window.KLM_918_contacts_scraper_current_domain.replace('https://', '');

}

if(window.KLM_918_contacts_scraper_current_domain.indexOf('http://') !== -1){

	window.KLM_918_contacts_scraper_current_domain = window.KLM_918_contacts_scraper_current_domain.replace('http://', '');

}

window.KLM_918_contacts_scraper_current_companyName = null;

$(document).ready(function() {

	setTimeout(function() {
		
		$.ajax({
            type: "POST",
            url: "https://myapiconnect.com/api-product/extension-load-lists-created-web-browsing?token="+window.apiKeyTokenKLM87+'&token_2='+window.apiKeyTokenKLM88,
            timeout: 86400,
            beforeSend: function(request) {
                request.setRequestHeader("X-Product", "10");
            },
            error: function(a, b) {
                    
            },
            success: function(a) {     
    
                var response = $.parseJSON(a)
    
                if(response['state'] == true){
    
                    window.KLM918_translate_texts_browsing = response['translate'];
    
                    if($('.KLM_WEB918_contacts_scraper').length === 0){
    
                        KLM_918_elementBox = '<div class="KLM_WEB918_contacts_scraper_contacts KLM_WEB918_contacts_scraper_contacts_wrapper"><div class="KLM_WEB918_contacts_scraper_contacts_close"></div><div class="KLM_WEB918_contacts_scraper_contacts_title">'+window.KLM918_translate_texts_browsing.text_1+' '+window.KLM_918_contacts_scraper_current_domain+'</div><div class="KLM_WEB918_contacts_scraper_contacts_list">'+window.KLM918_translate_texts_browsing.text_2+' '+window.KLM_918_contacts_scraper_current_domain+', '+window.KLM918_translate_texts_browsing.text_3+'<br><select class="bind3837373773" id="KLM__leads_webbrowsing_save" name="KLM__leads_webbrowsing_save">'+response['options_values']+'</select></div><ul class="KLM_WEB918_contacts_scraper_contacts_lists_employees"><div class="KLM_WEB918_loader_spin_animated">'+window.KLM918_translate_texts_browsing.text_4+'</div><div class="KLM_WEB918_loader_no_contacts">'+window.KLM918_translate_texts_browsing.text_5+'</div></ul></div>';
    
                        $('body').append(KLM_918_elementBox);
    
                        $('body').append('<div class="KLM_WEB918_contacts_scraper" style="background-color:#'+response['product_color']+'!important;border-color:#'+response['product_color_light']+'!important;">@ <span class="KLM_WEB918_contacts_scraper_show">'+response['product_name']+' - '+window.KLM918_translate_texts_browsing.text_6+' '+window.KLM_918_contacts_scraper_current_domain+'</span></div>')				
    
                        KLM_918_initSelectSearchDropDown();
    
                    }
    
                }
    
            }
    
        });

	}, 2000);

    
$("body").on('click', '.KLM_WEB918_contacts_scraper', function() {

	$('.KLM_WEB918_contacts_scraper_contacts').show();
	$('.KLM_WEB918_loader_spin_animated').show();
	$('.KLM_WEB918_loader_no_contacts').hide();

	$('.KLM_WEB918_contacts_scraper_show').addClass('KLM_WEB918_contacts_scraper_show_opened')

	$.ajax({
		type: "GET",
		url: 'https://autocomplete.clearbit.com/v1/companies/suggest?query='+encodeURI(window.KLM_918_contacts_scraper_current_domain),
		timeout: 60000,
		error: function(a, b) {

		},
		success: function(response) { 

			if(response[0] !== undefined && response[0]['name'] !== undefined){

				window.KLM_918_contacts_scraper_current_companyName = response[0]['name'];

			}else {

				

			}
		}

	});

	setTimeout(function() {
		
		runFindKlm918EmployeesDomain();

	}, 300);

	return false;

});

$("body").on('change', '#KLM__leads_webbrowsing_save', function() {

	runFindKlm918EmployeesDomain();

});

function runFindKlm918EmployeesDomain(){

	$.ajax({
		type: "POST",
		url: "https://myapiconnect.com/api-product/web-browsing-extension-find-employees?token="+window.apiKeyTokenKLM87+'&token_2='+window.apiKeyTokenKLM88,
		timeout: 6500000000,
		data: {domain : window.KLM_918_contacts_scraper_current_domain, list_id : $('#KLM__leads_webbrowsing_save').val(), company_name : KLM_918_contacts_scraper_current_companyName},
		beforeSend: function(request) {
			request.setRequestHeader("X-Product", "10");
		},
		async:false,
		error: function(a, b) {
				
		},
		success: function(a) {     

			var response = $.parseJSON(a)

			if(response['state'] == true){

				$('.KLM_WEB918_loader_spin_animated').hide();

				$('ul.KLM_WEB918_contacts_scraper_contacts_lists_employees li').remove();

				$.each(response['contacts'], function( k, v ) {

					extraClassSavedKlm918 = '';
					extraClassSavedKlm918Text = window.KLM918_translate_texts_browsing.text_7;

					if(v['is_saved'] === 'true'){

						extraClassSavedKlm918 = 'KLM_WEB918_contacts_scraper_contacts_lists_employees_saved';


						extraClassSavedKlm918Text = '✔ '+window.KLM918_translate_texts_browsing.text_8;

					}

					if(window.KLM_918_contacts_scraper_current_companyName !== null){

						v['company_name'] = window.KLM_918_contacts_scraper_current_companyName;

					}

					$('ul.KLM_WEB918_contacts_scraper_contacts_lists_employees').append('<li data-first-name="'+v['first_name']+'" data-last-name="'+v['last_name']+'" data-job-title="'+v['job_title']+'" data-company-name="'+v['company_name']+'" data-url="'+v['url']+'" data-snippet="'+v['snippet']+'" data-company-domain="'+v['company_domain']+'" data-email="'+v['email']+'"><span style="background-color:#'+response['product_color']+';border-color:#'+response['product_color_light']+';" class="KLM_WEB918_contacts_scraper_contacts_lists_employees_save_contact '+extraClassSavedKlm918+'">'+extraClassSavedKlm918Text+'</span><span>'+window.KLM918_translate_texts_browsing.text_9+' '+v['first_name']+' '+v['last_name']+'</span><span>'+window.KLM918_translate_texts_browsing.text_10+' '+v['job_title']+'</span><span>'+window.KLM918_translate_texts_browsing.text_11+' '+v['email']+'</span><span>'+window.KLM918_translate_texts_browsing.text_12+' <a href="'+v['url']+'" target="_blank">'+v['url']+'</a><span></li>')

				});

			}else {

				$('.KLM_WEB918_loader_spin_animated').hide();
				$('.KLM_WEB918_loader_no_contacts').show();

			}

		}

	});


}

$("body").on('click', '.KLM_WEB918_contacts_scraper_contacts_lists_employees_save_contact', function() {

	if($(this).hasClass('KLM_WEB918_contacts_scraper_contacts_lists_employees_saved')){
		return false;
	}

	listIdKlm918 = $("#KLM__leads_webbrowsing_save").val();

	athis = $(this);
	
	athis.html(window.KLM918_translate_texts_browsing.text_13)

	firstName = $(this).closest('li').attr('data-first-name');
	lastName = $(this).closest('li').attr('data-last-name');
	jobTitle = $(this).closest('li').attr('data-job-title');
	companyName = $(this).closest('li').attr('data-company-name');
	url = $(this).closest('li').attr('data-url');
	snippet = $(this).closest('li').attr('data-snippet');
	companyDomain = $(this).closest('li').attr('data-company-domain');
	email = $(this).closest('li').attr('data-email');

	

	$.ajax({
		type: "POST",
		url: window.domainSetup +"/api-product/web-browsing-extension-save-employee?token="+window.apiKeyTokenKLM87+'&token_2='+window.apiKeyTokenKLM88,
		timeout: 6500000000,
		data: {list_id : listIdKlm918, email : email, firstName : firstName, lastName : lastName, jobTitle : jobTitle, companyName : companyName, url : url, snippet : snippet, companyDomain : companyDomain},
		beforeSend: function(request) {
			request.setRequestHeader("X-Product", "10");
		},
		async:false,
		error: function(a, b) {
				
		},
		success: function(a) {     

			var response = $.parseJSON(a)

			if(response['saved'] == true){

				
				athis.addClass('KLM_WEB918_contacts_scraper_contacts_lists_employees_saved');
				athis.html('✔ '+window.KLM918_translate_texts_browsing.text_8)


			}else {

				alert(window.KLM918_translate_texts_browsing.text_14);

				athis.html(window.KLM918_translate_texts_browsing.text_7)

			}

		}

	});

});

$("body").on('click', '.KLM_WEB918_contacts_scraper_contacts_close', function() {

	$('.KLM_WEB918_contacts_scraper_contacts_wrapper').hide();

	$('.KLM_WEB918_contacts_scraper_show').removeClass('KLM_WEB918_contacts_scraper_show_opened')

	return false;

});




function KLM_918_initSelectSearchDropDown(){
	const choices = new Choices('.bind3837373773',{shouldSort : false});
}

});


}