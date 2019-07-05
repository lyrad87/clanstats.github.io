var bungieAPIkey = "0a11942f318647978979f13ad8aa53ee";
    var clan = {};
        clan.memberIds = [];
        clan.memberCount = 0;
        clan.membersFetched = 0;
        clan.memberName = {};
        clan.retryCounter = {};
        clan.unresolvedMemberNames = [];
        clan.membersWithLunasHowl = {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithNotForgotten = {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithMountaintop = {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithRedrixsBroadsword = {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithRecluse= {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithLoadedQuestion = {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithRevoker = {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithHush = {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithWendigo = {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithBreakneck = {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithMalfeasance = {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithOxygen = {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithTheLastWord = {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithTruth = {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithThorn = {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithDelirium = {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithIzanagisBurden = {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithTarrabah = {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithOneThousandVoices = {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithAnarchy = {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithOutbreakPerfected = {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithWhisper = {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithRedrixsClaymore = {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithWishEnder = {got: [],need: [],amountgot:0,amountneed:0};
        clan.membersWithDutyBound = {got: [],need: [],amountgot:0,amountneed:0};
        
$(document).ready(function() {
    $.ajax({
        url: "https://www.bungie.net/Platform/GroupV2/1801684/Members/",
        headers: {
            "X-API-KEY": bungieAPIkey
        },
        method: "GET"
    }).done(function(data) {
        if (!data.Response) {
            $("#claninfo").html("API down?");
            return
        }
        $.each(data.Response.results, function(index, value) {
            clan.memberIds.push(value.destinyUserInfo.membershipId);
            clan.retryCounter[value.destinyUserInfo.membershipId] = 0;
            clan.memberName[value.destinyUserInfo.membershipId] = value.destinyUserInfo.displayName
        });
        clan.memberCount = clan.memberIds.length;
        $.each(clan.memberIds, function(index, memberid) {
            getAccountData(memberid);
            checkForSpecialAchievements(memberid)
        })
    })
});
$(document).ajaxStop(function() {
    $(".sk-folding-cube").hide();
    if (clan.unresolvedMemberNames.length > 0) $(".cubelegend").append("<br><small>(unable to fetch " + clan.unresolvedMemberNames.join(", ") + ")</small>")
});

function getAccountData(memberid) {
    clan.retryCounter[memberid] = clan.retryCounter[memberid] + 1;
    if (clan.retryCounter[memberid] > 4) {
        clan.unresolvedMemberNames.push(clan.memberName[memberid]);
        return
    }
    $.ajax({
        url: "https://www.bungie.net/Platform/Destiny2/2/Account/" + memberid + "/Character/0/Stats/",
        headers: {
            "X-API-KEY": bungieAPIkey
        },
        data: {
            groups: "1,3",
            modes: "4,5,7,10,12,15,19,25,31,32,37,38,39,41,42,43,44,45,48,49,50,51,52,53,5,4,55,56,57,59,60,61,62,64,65,68,69,70,71,72,73,74"
        },
        method: "GET"
    }).done(function(data) {
        if (data.ErrorCode > 1 || !data.Response) getAccountData(memberid);
        else {
            clan.membersFetched = clan.membersFetched +
                1;
            outputClanData(clan)
        }
    });
    return
}

function checkForSpecialAchievements(memberid) {
    var aquiredCollectibleStateValues = [0, 8, 16, 64, 80];
    $.ajax({
        url: "https://www.bungie.net/Platform/Destiny2/2/Profile/" + memberid + "/?components=800,900",
        headers: {
            "X-API-KEY": bungieAPIkey
        },
        method: "GET"
    }).done(function(data) {
        if (data.ErrorCode > 1 || !data.Response || typeof data.Response.profileCollectibles.data === "undefined") {
            clan.retryCounter[memberid]++;
            if (clan.retryCounter[memberid] > 4) {
                clan.unresolvedMemberNames.push(clan.memberName[memberid]);
                return
            }
            checkForSpecialAchievements(memberid)
        } else {
            clan.membersWithLunasHowl = clan.membersWithLunasHowl + (jQuery.inArray(data.Response.profileCollectibles.data.collectibles[3260604718].state, aquiredCollectibleStateValues) !== -1 ? 1 : 0);
            clan.membersWithNotForgotten = clan.membersWithNotForgotten + (jQuery.inArray(data.Response.profileCollectibles.data.collectibles[3260604717].state, aquiredCollectibleStateValues) !== -1 ? 1 : 0);
            clan.membersWithRecluse = clan.membersWithRecluse + (jQuery.inArray(data.Response.profileCollectibles.data.collectibles[2335550020].state, aquiredCollectibleStateValues) !== -1 ? 1 : 0);
            clan.membersWithMountaintop = clan.membersWithMountaintop + (jQuery.inArray(data.Response.profileCollectibles.data.collectibles[4047371119].state, aquiredCollectibleStateValues) !== -1 ? 1 : 0);
            clan.membersWithRedrixsBroadsword = clan.membersWithRedrixsBroadsword + (jQuery.inArray(data.Response.profileCollectibles.data.collectibles[1111219481].state, aquiredCollectibleStateValues) !== -1 ? 1 : 0);
            clan.membersWithLoadedQuestion = clan.membersWithLoadedQuestion + (jQuery.inArray(data.Response.profileCollectibles.data.collectibles[3810740723].state, aquiredCollectibleStateValues) !== -1 ? 1 : 0);
            clan.membersWithRevoker = clan.membersWithRevoker + (jQuery.inArray(data.Response.profileCollectibles.data.collectibles[3066162258].state, aquiredCollectibleStateValues) !== -1 ? 1 : 0);
            clan.membersWithHush = clan.membersWithHush + (jQuery.inArray(data.Response.profileCollectibles.data.collectibles[1670904512].state, aquiredCollectibleStateValues) !== -1 ? 1 : 0);
            clan.membersWithWendigo = clan.membersWithWendigo + (jQuery.inArray(data.Response.profileCollectibles.data.collectibles[3830703103].state, aquiredCollectibleStateValues) !== -1 ? 1 : 0);
            clan.membersWithBreakneck = clan.membersWithBreakneck + (jQuery.inArray(data.Response.profileCollectibles.data.collectibles[1666039008].state, aquiredCollectibleStateValues) !== -1 ? 1 : 0);
            clan.membersWithMalfeasance = clan.membersWithMalfeasance + (jQuery.inArray(data.Response.profileCollectibles.data.collectibles[1660030045].state, aquiredCollectibleStateValues) !== -1 ? 1 : 0);
            clan.membersWithOxygen = clan.membersWithOxygen + (jQuery.inArray(data.Response.profileCollectibles.data.collectibles[543982652].state, aquiredCollectibleStateValues) !== -1 ? 1 : 0);
            clan.membersWithTheLastWord = clan.membersWithTheLastWord + (jQuery.inArray(data.Response.profileCollectibles.data.collectibles[3074058273].state, aquiredCollectibleStateValues) !== -1 ? 1 : 0);
            clan.membersWithTruth = clan.membersWithTruth + (jQuery.inArray(data.Response.profileCollectibles.data.collectibles[1763840761].state, aquiredCollectibleStateValues) !== -1 ? 1 : 0);
            clan.membersWithThorn = clan.membersWithThorn + (jQuery.inArray(data.Response.profileCollectibles.data.collectibles[4009683574].state, aquiredCollectibleStateValues) !== -1 ? 1 : 0);
            clan.membersWithDelirium = clan.membersWithDelirium + (jQuery.inArray(data.Response.profileCollectibles.data.collectibles[1639266456].state, aquiredCollectibleStateValues) !== -1 ? 1 : 0);
            clan.membersWithIzanagisBurden = clan.membersWithIzanagisBurden + (jQuery.inArray(data.Response.profileCollectibles.data.collectibles[24541428].state, aquiredCollectibleStateValues) !== -1 ? 1 : 0);
            clan.membersWithTarrabah = clan.membersWithTarrabah + (jQuery.inArray(data.Response.profileCollectibles.data.collectibles[2329697053].state, aquiredCollectibleStateValues) !== -1 ? 1 : 0); 
            clan.membersWithOneThousandVoices = clan.membersWithOneThousandVoices + (jQuery.inArray(data.Response.profileCollectibles.data.collectibles[199171385].state, aquiredCollectibleStateValues) !== -1 ? 1 : 0);
            clan.membersWithAnarchy = clan.membersWithAnarchy + (jQuery.inArray(data.Response.profileCollectibles.data.collectibles[2220014607].state, aquiredCollectibleStateValues) !== -1 ? 1 : 0);
            clan.membersWithOutbreakPerfected = clan.membersWithOutbreakPerfected + (jQuery.inArray(data.Response.profileCollectibles.data.collectibles[2500286745].state, aquiredCollectibleStateValues) !== -1 ? 1 : 0);
            clan.membersWithWhisper = clan.membersWithWhisper + (jQuery.inArray(data.Response.profileCollectibles.data.collectibles[3875807583].state, aquiredCollectibleStateValues) !== -1 ? 1 : 0);
            
            //profileCollectibles system 
            if (jQuery.inArray(data.Response.profileCollectibles.data.collectibles[1660030044].state, aquiredCollectibleStateValues) !== -1) {
                clan.membersWithWishEnder.amountgot = clan.membersWithWishEnder.amountgot + 1;
                clan.membersWithWishEnder.got.push(clan.memberName[memberid]);
            } else {
                clan.membersWithWishEnder.amountneed = clan.membersWithWishEnder.amountneed + 1;
                clan.membersWithWishEnder.need.push(clan.memberName[memberid]);
            }
            
            //characterCollectibles system
            tmpItemWasNotFound = true;
            $.each(data.Response.characterCollectibles.data, function(index, value) {
                if ((jQuery.inArray(value.collectibles[1333654061].state, aquiredCollectibleStateValues) !== -1)) {
                    clan.membersWithDutyBound.amountgot = clan.membersWithDutyBound.amountgot + 1;
                    clan.membersWithDutyBound.got.push(clan.memberName[memberid]);
                    tmpItemWasNotFound = false;
                    return false
                }
            });
            if (tmpItemWasNotFound) {
                clan.membersWithDutyBound.amountneed = clan.membersWithDutyBound.amountneed + 1;
                clan.membersWithDutyBound.need.push(clan.memberName[memberid]);
            }

            outputClanData(clan)
        }
    });
    return
}

function getDescendantProp(obj, desc) {
    var arr = desc.split(".");
    while (arr.length && (obj = obj[arr.shift()]));
    return obj
}

function outputClanData(clanobject) {
    $("#LunasHowl").html(clanobject.membersWithLunasHowl.amountgot);
    $("#NotForgotten").html(clanobject.membersWithNotForgotten.amountgot);
    $("#Mountaintop").html(clanobject.membersWithMountaintop.amountgot);
    $("#RedrixsBroadsword").html(clanobject.membersWithRedrixsBroadsword.amountgot);
    $("#Recluse").html(clanobject.membersWithRecluse.amountgot);
    $("#LoadedQuestion").html(clanobject.membersWithLoadedQuestion.amountgot);
    $("#Revoker").html(clanobject.membersWithRevoker.amountgot);
    $("#Hush").html(clanobject.membersWithHush.amountgot);
    $("#Wendigo").html(clanobject.membersWithWendigo.amountgot);
    $("#Breakneck").html(clanobject.membersWithBreakneck.amountgot);
    $("#Malfeasance").html(clanobject.membersWithMalfeasance.amountgot);
    $("#Oxygen").html(clanobject.membersWithOxygen.amountgot);
    $("#TheLastWord").html(clanobject.membersWithTheLastWord.amountgot);
    $("#Truth").html(clanobject.membersWithTruth.amountgot);
    $("#Thorn").html(clanobject.membersWithThorn.amountgot);
    $("#Delirium").html(clanobject.membersWithDelirium.amountgot);
    $("#IzanagisBurden").html(clanobject.membersWithIzanagisBurden.amountgot);
    $("#Tarrabah").html(clanobject.membersWithTarrabah.amountgot);
    $("#OneThousandVoices").html(clanobject.membersWithOneThousandVoices.amountgot);
    $("#Anarchy").html(clanobject.membersWithAnarchy.amountgot);
    $("#OutbreakPerfected").html(clanobject.membersWithOutbreakPerfected.amountgot);
    $("#Whisper").html(clanobject.membersWithWhisper.amountgot);
    $("#RedrixsClaymore").html(clanobject.membersWithRedrixsClaymore.amountgot);
    $("#WishEnder").html(clanobject.membersWithWishEnder.amountgot);
    $("#DutyBound").html(clanobject.membersWithDutyBound.amountgot);
    $("#membercounter").html(clanobject.membersFetched + "/" + clanobject.memberCount);
    return
};

$(document).ready(function () {

    $('.btn-filter').on('click', function () {
      var $target = $(this).data('target');
      if ($target != 'all') {
        $('.table tr:not(.alwaysthere)').css('display', 'none');
        $('.table tr[data-status="' + $target + '"]').fadeIn('slow');
      } else {
        $('.table tr').css('display', 'none').fadeIn('slow');
      };
    });

 });