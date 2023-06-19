/*

  -------------------------------------
    Provider for ESPN Scoreboard Data
  -------------------------------------

  Provides scores for
    NCAAF (College Football, FBS Division)
    NCAAM (College Basketball. Division I)
    NCAAM_MM (College Basketball, March Madness Torunament)
    NBA (National Basketball Association)
    Every fucking Soccer league ESPN supports

  You can get an idea of what sports and leagues are
  supported here:
  http://www.espn.com/static/apis/devcenter/io-docs.html

  Documentation for the feed can be found here:
  http://www.espn.com/static/apis/devcenter/docs/scores.html#parameters

  ESPN has several different APIs for various sports data,
  most of which need an API key.  ESPN no longer gives out
  public API keys.  The good news is the Scoreboard API does
  not require an API key. It's free and clear.  Let's not
  abuse this.  Please do not modify this to hammer the API
  with a flood of calls, otherwise it might cause ESPN to
  lock this it down.

  Data is polled on demand per league configured in the
  front end. Each time the front end makes a request for a
  particular league a request for JSON is made to ESPN's
  servers.  The front end polls every two miuntes.

*/

var axios = require('axios').default;
const moment = require("moment-timezone");

module.exports = {

  PROVIDER_NAME: "ESPN",

  LEAGUE_PATHS: {

    //North American Leagues
    "NCAAF": "football/college-football",
    "NBA": "basketball/nba",
    "NCAAM": "basketball/mens-college-basketball",
    "NCAAM_MM": "basketball/mens-college-basketball",
    "MLB": "baseball/mlb",
    "NFL": "football/nfl",
    "NHL": "hockey/nhl",
    "GOLF": "golf/pga",

    //International Soccer
    "AFC_ASIAN_CUP": "soccer/afc.cup",
    "AFC_ASIAN_CUP_Q": "soccer/afc.cupq",
    "AFF_CUP": "soccer/aff.championship",
    "AFR_NATIONS_CUP": "soccer/caf.nations",
    "AFR_NATIONS_CUP_Q": "soccer/caf.nations_qual",
    "AFR_NATIONS_CHAMPIONSHIP": "soccer/caf.championship",
    "CONCACAF_GOLD_CUP": "soccer/concacaf.gold",
    "CONCACAF_NATIONS_Q": "soccer/concacaf.nations.league_qual",
    "CONCACAF_WOMENS_CHAMPIONSHIP": "soccer/concacaf.womens.championship",
    "CONMEBOL_COPA_AMERICA": "soccer/conmebol.america",
    "FIFA_CLUB_WORLD_CUP": "soccer/fifa.cwc",
    "FIFA_CONFEDERATIONS_CUP": "soccer/fifa.confederations",
    "FIFA_MENS_FRIENDLIES": "soccer/fifa.friendly",
    "FIFA_MENS_OLYMPICS": "soccer/fifa.olympics",
    "FIFA_WOMENS_FRIENDLIES": "soccer/fifa.friendly.w",
    "FIFA_WOMENS_OLYMPICS": "soccer/fifa.w.olympics",
    "FIFA_WOMENS_WORLD_CUP": "soccer/fifa.wwc",
    "FIFA_WORLD_CUP": "soccer/fifa.world",
    "FIFA_WORLD_CUP_Q_AFC": "soccer/fifa.worldq.afc",
    "FIFA_WORLD_CUP_Q_CAF": "soccer/fifa.worldq.caf",
    "FIFA_WORLD_CUP_Q_CONCACAF": "soccer/fifa.worldq.concacaf",
    "FIFA_WORLD_CUP_Q_CONMEBOL": "soccer/fifa.worldq.conmebol",
    "FIFA_WORLD_CUP_Q_OFC": "soccer/fifa.worldq.ofc",
    "FIFA_WORLD_CUP_Q_UEFA": "soccer/fifa.worldq.uefa",
    "FIFA_WORLD_U17": "soccer/fifa.world.u17",
    "FIFA_WORLD_U20": "soccer/fifa.world.u20",
    "UEFA_CHAMPIONS": "soccer/uefa.champions",
    "UEFA_EUROPA": "soccer/uefa.europa",
    "UEFA_EUROPEAN_CHAMPIONSHIP": "soccer/uefa.euro",
    "UEFA_EUROPEAN_CHAMPIONSHIP_Q": "soccer/uefa.euroq",
    "UEFA_EUROPEAN_CHAMPIONSHIP_U19": "soccer/uefa.euro.u19",
    "UEFA_EUROPEAN_CHAMPIONSHIP_U21": "soccer/uefa.euro_u21",
    "UEFA_NATIONS": "soccer/uefa.nations",
    "SAFF_CHAMPIONSHIP": "soccer/afc.saff.championship",
    "WOMENS_EUROPEAN_CHAMPIONSHIP": "soccer/uefa.weuro",

    //UK / Ireland Soccer
    "ENG_CARABAO_CUP": "soccer/eng.league_cup",
    "ENG_CHAMPIONSHIP": "soccer/eng.2",
    "ENG_EFL": "soccer/eng.trophy",
    "ENG_FA_CUP": "soccer/eng.fa",
    "ENG_LEAGUE_1": "soccer/eng.3",
    "ENG_LEAGUE_2": "soccer/eng.4",
    "ENG_NATIONAL": "soccer/eng.5",
    "ENG_PREMIERE_LEAGUE": "soccer/eng.1",
    "IRL_PREM": "soccer/irl.1",
    "NIR_PREM": "soccer/nir.1",
    "SCO_CIS": "soccer/sco.cis",
    "SCO_CHALLENGE_CUP": "soccer/sco.challenge",
    "SCO_CHAMPIONSHIP": "soccer/sco.2",
    "SCO_CUP": "soccer/sco.tennents",
    "SCO_LEAGUE_1": "soccer/sco.3",
    "SCO_LEAGUE_2": "soccer/sco.4",
    "SCO_PREM": "soccer/sco.1",
    "WAL_PREM": "soccer/wal.1",

    //European Soccer
    "AUT_BUNDESLIGA": "soccer/aut.1",
    "BEL_DIV_A": "soccer/bel.1",
    "DEN_SAS_LIGAEN": "soccer/den.1",
    "ESP_COPA_DEL_REY": "soccer/esp.copa_del_rey",
    "ESP_LALIGA": "soccer/esp.1",
    "ESP_SEGUNDA_DIV": "soccer/esp.2",
    "FRA_COUPE_DE_FRANCE": "soccer/fra.coupe_de_france",
    "FRA_COUPE_DE_LA_LIGUE": "soccer/fra.coupe_de_la_ligue",
    "FRA_LIGUE_1": "soccer/fra.1",
    "FRA_LIGUE_2": "soccer/fra.2",
    "GER_2_BUNDESLIGA": "soccer/ger.2",
    "GER_BUNDESLIGA": "soccer/ger.1",
    "GER_DFB_POKAL": "soccer/ger.dfb_pokal",
    "GRE_SUPER_LEAGUE": "soccer/gre.1",
    "ISR_PREMIER_LEAGUE": "soccer/isr.1",
    "ITA_SERIE_A": "soccer/ita.1",
    "ITA_SERIE_B": "soccer/ita.2",
    "ITA_COPPA_ITALIA": "soccer/ita.coppa_italia",
    "MLT_PREMIER_LEAGUE": "soccer/mlt.1",
    "NED_EERSTE_DIVISIE": "soccer/ned.2",
    "NED_EREDIVISIE": "soccer/ned.1",
    "NED_KNVB_BEKER": "soccer/ned.cup",
    "NOR_ELITESERIEN": "soccer/nor.1",
    "POR_LIGA": "soccer/por.1",
    "ROU_FIRST_DIV": "soccer/rou.1",
    "RUS_PREMIER_LEAGUE": "soccer/rus.1",
    "SUI_SUPER_LEAGUE": "soccer/sui.1",
    "SWE_ALLSVENSKANLIGA": "soccer/swe.1",
    "TUR_SUPER_LIG": "soccer/tur.1",

    //South American Soccer
    "ARG_COPA": "soccer/arg.copa",
    "ARG_NACIONAL_B": "soccer/arg.2",
    "ARG_PRIMERA_DIV_B": "soccer/arg.3",
    "ARG_PRIMERA_DIV_C": "soccer/arg.4",
    "ARG_PRIMERA_DIV_D": "soccer/arg.5",
    "ARG_SUPERLIGA": "soccer/arg.1",
    "BOL_LIGA_PRO": "soccer/bol.1",
    "BRA_CAMP_CARIOCA": "soccer/bra.camp.carioca",
    "BRA_CAMP_GAUCHO": "soccer/bra.camp.gaucho",
    "BRA_CAMP_MINEIRO": "soccer/bra.camp.mineiro",
    "BRA_CAMP_PAULISTA": "soccer/bra.camp.paulista",
    "BRA_COPA": "soccer/bra.copa_do_brazil",
    "BRA_SERIE_A": "soccer/bra.1",
    "BRA_SERIE_B": "soccer/bra.2",
    "BRA_SERIE_C": "soccer/bra.3",
    "CHI_COPA": "soccer/chi.copa_chi",
    "CHI_PRIMERA_DIV": "soccer/chi.1",
    "COL_COPA": "soccer/col.copa",
    "COL_PRIMERA_A": "soccer/col.1",
    "COL_PRIMERA_B": "soccer/col.2",
    "CONMEBOL_COPA_LIBERTADORES": "soccer/conmebol.libertadores",
    "CONMEBOL_COPA_SUDAMERICANA": "soccer/conmebol.sudamericana",
    "ECU_PRIMERA_A": "soccer/ecu.1",
    "PAR_PRIMERA_DIV": "soccer/par.1",
    "PER_PRIMERA_PRO": "soccer/per.1",
    "URU_PRIMERA_DIV": "soccer/uru.1",
    "VEN_PRIMERA_PRO": "soccer/ven.1",

    //North American Soccer
    "CONCACAF_CHAMPIONS": "soccer/concacaf.champions",
    "CONCACAF_LEAGUE": "soccer/concacaf.league",
    "CRC_PRIMERA_DIV": "soccer/crc.1",
    "GUA_LIGA_NACIONAL": "soccer/gua.1",
    "HON_PRIMERA_DIV": "soccer/hon.1",
    "JAM_PREMIER_LEAGUE": "soccer/jam.1",
    "MEX_ASCENSO_MX": "soccer/mex.2",
    "MEX_COPA_MX": "soccer/mex.copa_mx",
    "MEX_LIGA_BANCOMER": "soccer/mex.1",
    "SLV_PRIMERA_DIV": "soccer/slv.1",
    "USA_MLS": "soccer/usa.1",
    "USA_NCAA_SL_M": "soccer/usa.ncaa.m.1",
    "USA_NCAA_SL_W": "soccer/usa.ncaa.w.1",
    "USA_NASL": "soccer/usa.nasl",
    "USA_NWSL": "soccer/usa.nwsl",
    "USA_OPEN": "soccer/usa.open",
    "USA_USL": "soccer/usa.usl.1",

    //Asian Soccer
    "AFC_CHAMPIONS": "soccer/afc.champions",
    "AUS_A_LEAGUE": "soccer/aus.1",
    "CHN_SUPER_LEAGUE": "soccer/chn.1",
    "IDN_SUPER_LEAGUE": "soccer/idn.1",
    "IND_I_LEAGUE": "soccer/ind.2",
    "IND_SUPER_LEAGUE": "soccer/ind.1",
    "JPN_J_LEAGUE": "soccer/jpn.1",
    "MYS_SUPER_LEAGUE": "soccer/mys.1",
    "SGP_PREMIER_LEAGUE": "soccer/sgp.1",
    "THA_PREMIER_LEAGUE": "soccer/tha.1",

    //African Soccer
    "CAF_CHAMPIONS": "soccer/caf.champions",
    "CAF_CONFED_CUP": "soccer/caf.confed",
    "GHA_PREMIERE_LEAGUE": "soccer/gha.1",
    "KEN_PREMIERE_LEAGUE": "soccer/ken.1",
    "NGA_PRO_LEAGUE": "soccer/nga.1",
    "RSA_FIRST_DIV": "soccer/rsa.2",
    "RSA_NEDBANK_CUP": "soccer/rsa.nedbank",
    "RSA_PREMIERSHIP": "soccer/rsa.1",
    "RSA_TELKOM_KNOCKOUT": "soccer/rsa.telkom_knockout",
    "UGA_SUPER_LEAGUE": "soccer/uga.1",
    "ZAM_SUPER_LEAGUE": "soccer/zam.1",
    "ZIM_PREMIER_LEAGUE": "soccer/zim.1",

  },

  /*
    Used with isSoccer() so that we can quickly identify soccer leagues
    for score display patterns, instead of IFs for each league
   */
  SOCCER_LEAGUES: [

    //International
    "AFC_ASIAN_CUP",
    "AFC_ASIAN_CUP_Q",
    "AFF_CUP",
    "AFR_NATIONS_CUP",
    "AFR_NATIONS_CUP_Q",
    "CONCACAF_GOLD_CUP",
    "CONCACAF_NATIONS_Q",
    "CONCACAF_WOMENS_CHAMPIONSHIP",
    "CONMEBOL_COPA_AMERICA",
    "FIFA_CLUB_WORLD_CUP",
    "FIFA_CONFEDERATIONS_CUP",
    "FIFA_MENS_FRIENDLIES",
    "FIFA_MENS_OLYMPICS",
    "FIFA_WOMENS_FRIENDLIES",
    "FIFA_WOMENS_WORLD_CUP",
    "FIFA_WOMENS_OLYMPICS",
    "FIFA_WORLD_CUP",
    "FIFA_WORLD_CUP_Q_AFC",
    "FIFA_WORLD_CUP_Q_CAF",
    "FIFA_WORLD_CUP_Q_CONCACAF",
    "FIFA_WORLD_CUP_Q_CONMEBOL",
    "FIFA_WORLD_CUP_Q_OFC",
    "FIFA_WORLD_CUP_Q_UEFA",
    "FIFA_WORLD_U17",
    "FIFA_WORLD_U20",
    "UEFA_CHAMPIONS",
    "UEFA_EUROPA",
    "UEFA_EUROPEAN_CHAMPIONSHIP",
    "UEFA_EUROPEAN_CHAMPIONSHIP_Q",
    "UEFA_EUROPEAN_CHAMPIONSHIP_U19",
    "UEFA_EUROPEAN_CHAMPIONSHIP_U21",
    "UEFA_NATIONS",
    "SAFF_CHAMPIONSHIP",
    "WOMENS_EUROPEAN_CHAMPIONSHIP",

    // UK / Ireland
    "ENG_CARABAO_CUP",
    "ENG_CHAMPIONSHIP",
    "ENG_EFL",
    "ENG_FA_CUP",
    "ENG_LEAGUE_1",
    "ENG_LEAGUE_2",
    "ENG_NATIONAL",
    "ENG_PREMIERE_LEAGUE",
    "IRL_PREM",
    "NIR_PREM",
    "SCO_PREM",
    "SCO_CHAMPIONSHIP",
    "SCO_CHALLENGE_CUP",
    "SCO_CIS",
    "SCO_CUP",
    "SCO_LEAGUE_1",
    "SCO_LEAGUE_2",
    "WAL_PREM",

    //Europe
    "AUT_BUNDESLIGA",
    "BEL_DIV_A",
    "DEN_SAS_LIGAEN",
    "ESP_COPA_DEL_REY",
    "ESP_LALIGA",
    "ESP_SEGUNDA_DIV",
    "FRA_COUPE_DE_FRANCE",
    "FRA_COUPE_DE_LA_LIGUE",
    "FRA_LIGUE_1",
    "FRA_LIGUE_2",
    "GER_2_BUNDESLIGA",
    "GER_BUNDESLIGA",
    "GER_DFB_POKAL",
    "GRE_SUPER_LEAGUE",
    "ISR_PREMIER_LEAGUE",
    "ITA_COPPA_ITALIA",
    "ITA_SERIE_A",
    "ITA_SERIE_B",
    "MLT_PREMIER_LEAGUE",
    "NED_EERSTE_DIVISIE",
    "NED_EREDIVISIE",
    "NED_KNVB_BEKER",
    "NOR_ELITESERIEN",
    "POR_LIGA",
    "ROU_FIRST_DIV",
    "RUS_PREMIER_LEAGUE",
    "TUR_SUPER_LIG",
    "SUI_SUPER_LEAGUE",
    "SWE_ALLSVENSKANLIGA",

    //South America
    "ARG_COPA",
    "ARG_NACIONAL_B",
    "ARG_PRIMERA_DIV_B",
    "ARG_PRIMERA_DIV_C",
    "ARG_PRIMERA_DIV_D",
    "ARG_SUPERLIGA",
    "BOL_LIGA_PRO",
    "BRA_CAMP_CARIOCA",
    "BRA_CAMP_GAUCHO",
    "BRA_CAMP_MINEIRO",
    "BRA_CAMP_PAULISTA",
    "BRA_COPA",
    "BRA_SERIE_A",
    "BRA_SERIE_B",
    "BRA_SERIE_C",
    "CHI_COPA",
    "CHI_PRIMERA_DIV",
    "COL_COPA",
    "COL_PRIMERA_A",
    "COL_PRIMERA_B",
    "CONMEBOL_COPA_LIBERTADORES",
    "CONMEBOL_COPA_SUDAMERICANA",
    "ECU_PRIMERA_A",
    "PAR_PRIMERA_DIV",
    "PER_PRIMERA_PRO",
    "URU_PRIMERA_DIV",
    "VEN_PRIMERA_PRO",

    //North American
    "CONCACAF_CHAMPIONS",
    "CONCACAF_LEAGUE",
    "CRC_PRIMERA_DIV",
    "GUA_LIGA_NACIONAL",
    "HON_PRIMERA_DIV",
    "JAM_PREMIER_LEAGUE",
    "MEX_ASCENSO_MX",
    "MEX_COPA_MX",
    "MEX_LIGA_BANCOMER",
    "SLV_PRIMERA_DIV",
    "USA_MLS",
    "USA_NCAA_SL_M",
    "USA_NCAA_SL_W",
    "USA_NASL",
    "USA_NWSL",
    "USA_OPEN",
    "USA_USL",

    //Asia
    "AFC_CHAMPIONS",
    "AUS_A_LEAGUE",
    "CHN_SUPER_LEAGUE",
    "IDN_SUPER_LEAGUE",
    "IND_I_LEAGUE",
    "IND_SUPER_LEAGUE",
    "JPN_J_LEAGUE",
    "MYS_SUPER_LEAGUE",
    "SGP_PREMIER_LEAGUE",
    "THA_PREMIER_LEAGUE",

    //Africa
    "CAF_CHAMPIONS",
    "CAF_CONFED_CUP",
    "GHA_PREMIERE_LEAGUE",
    "KEN_PREMIERE_LEAGUE",
    "NGA_PRO_LEAGUE",
    "RSA_FIRST_DIV",
    "RSA_NEDBANK_CUP",
    "RSA_PREMIERSHIP",
    "RSA_TELKOM_KNOCKOUT",
    "UGA_SUPER_LEAGUE",
    "ZAM_SUPER_LEAGUE",
    "ZIM_PREMIER_LEAGUE",
  ],

  getLeaguePath: function(league) {
    return this.LEAGUE_PATHS[league];
  },

  getScores: function(league, teams, gameDate, callback) {

    var self = this;

    var url = "http://site.api.espn.com/apis/site/v2/sports/" +
      this.getLeaguePath(league) +
      "/scoreboard?dates=" +
      moment(gameDate).format("YYYYMMDD") + "&limit=200";

    //golf leaderboard is different url
    if(league == "GOLF") {
	    url = "http://site.api.espn.com/apis/site/v2/sports/golf/leaderboard?league="+teams[0].toLowerCase();
    }

    /*
      by default, ESPN returns only the Top 25 ranked teams for NCAAF
      and NCAAM. By appending the group parameter (80 for NCAAF and 50
      for NCAAM, found in the URL of their respective scoreboard pages
      on ESPN.com) we'll get the entire game list.

      March Madness is grouped separately in ESPN's feed. The way I
      currently have things set up, I need to treat it like a different
      league.
    */
    if (league == "NCAAF") {
      url = url + "&groups=80";
    } else if (league == "NCAAM") {
      url = url + "&groups=50";
    } else if (league == "NCAAM_MM") {
      url = url + "&groups=100";
    }

	  axios.get(url)
		  .then(function (response) {

      if(response.status == 200) {
            callback(self.formatScores(league, response.data, teams));

      } else {
        console.log( "[MMM-MyScoreboard]  ** ERROR ** Couldn't retrieve " + league + " data for provider ESPN: " + response.status );
//        console.log( "[MMM-MyScoreboard] " + url );

      }
    })
	  .catch(function (error) {
		  // handle error
		  console.log( "[MMM-MyScoreboard] ESPN " + moment().format("D-MMM-YY HH:mm") + " ** ERROR ** " + error );
	});
  },

  formatScores: function(league, data, teams) {

    // var self = this;
    var formattedGamesList = new Array();
    var localTZ = moment.tz.guess();

    var filteredGamesList;
    if(league == "GOLF") {
	    if(data.events.length > 0) {
        var eventData = data.events[0].competitions[0];
	if(typeof eventData.scoringSystem === 'undefined') {
	  eventData = eventData[0];
	  console.log( "[MMM-MyScoreboard] "+eventData.scoringSystem.name);
	}
        if(eventData.scoringSystem.name != "Medal") {
          // special event match
          formattedGamesList = this.formatGolfMatchPlay(eventData, data.events[0].name, teams);
        } else {
          formattedGamesList = this.formatGolfStrokePlay(eventData, data.events[0].name, teams);
        }
      }
    } else {
    	if (teams != null)  { //filter to teams list

      	    filteredGamesList = data.events.filter(function(game) {

            //if "@T25" is in the teams list, it indicates to include teams ranked in the top 25
            if (teams.indexOf("@T25") != -1 &&
            ( (game.competitions[0].competitors[0].curatedRank.current >= 1 &&
                game.competitions[0].competitors[0].curatedRank.current <= 25) ||
                (game.competitions[0].competitors[1].curatedRank.current >= 1 &&
                    game.competitions[0].competitors[1].curatedRank.current <= 25) )) {
          	return true;
            }

            return teams.indexOf(game.competitions[0].competitors[0].team.abbreviation) != -1 ||
                teams.indexOf(game.competitions[0].competitors[1].team.abbreviation) != -1;
      	    });

    	} else { //return all games
      	    filteredGamesList = data.events;
    	}

    	//sort by start time, then by away team shortcode.
    	filteredGamesList.sort(function(a,b) {
      	var aTime = moment(a.competitions[0].date);
      	var bTime = moment(b.competitions[0].date);

      	//first sort by start time
      	if (aTime.isBefore(bTime)) {
            return -1;
      	}
       	if (aTime.isAfter(bTime)) {
            return 1;
      	}

      	//start times are the same.  Now sort by away team short codes
      	var aTteam = (a.competitions[0].competitors[0].homeAway == "away" ?
          a.competitions[0].competitors[0].team.abbreviation :
          a.competitions[0].competitors[1].team.abbreviation);

      	var bTteam = (b.competitions[0].competitors[0].homeAway == "away" ?
          b.competitions[0].competitors[0].team.abbreviation :
          b.competitions[0].competitors[1].team.abbreviation);


      	if (aTteam < bTteam) {
            return -1;
      	}
      	if (aTteam > bTteam) {
            return 1;
      	}
      	return 0;
    	});

    	//iterate through games and construct formattedGamesList
    	filteredGamesList.forEach(game => {

      		var status = [];
      		var classes = [];
      		var gameState = 0;
      		var hTeamData = game.competitions[0].competitors[0];
      		var vTeamData = game.competitions[0].competitors[1];
      		/*
        		Looks like the home team is always the first in the feed, but it also specified,
        		so we can be sure.
      		*/

      		if (hTeamData.homeAway == "away") {
        		hTeamData = game.competitions[0].competitors[1];
        		vTeamData = game.competitions[0].competitors[0];
      		}

      		/*
        		Not all of ESPN's status.type.id's are supported here.
        		Some are for sports that this provider doesn't yet
        		support, and some are so rare that we'll likely never
        		see it.  These cases are handled in the 'default' block.
      		*/
      		switch (game.status.type.id) {
        		case "0" : //TBD
          			gameState = 0;
          			status.push("TBD");
          			break;
        		case "1": //scheduled
          			gameState = 0;
          			status.push(moment(game.competitions[0].date).tz(localTZ).format("h:mm a"));
          			break;
        		case "2": //in-progress
        		case "21": //beginning of period
        		case "24": //overtime
        		case "25": //SOCCER first half
        		case "26": //SOCCER second half
        		case "43": //SOCCER Golden Time
        		case "44": //Shootout
                if(league == "MLB") {
                  gameState = 1;
          			  status.push(game.status.type.shortDetail);
                } else {
                  gameState = 1;
          			  status.push(game.status.displayClock);
          			  status.push(this.getPeriod(league, game.status.period));
                }
          			break;
        		case "3": //final
          			gameState = 2;
          			status.push("Final" + this.getFinalOT(league, game.status.period));
          			break;
        		case "4": //forfeit
        		case "9": //forfeit of home team
        		case "10": //forfeit of away team
          			gameState = 0;
          			status.push("Forfeit");
          			break;
        		case "5": //cancelled
          			gameState = 0;
          			status.push("Cancelled");
          			break;
        		case "6": //postponed
          			gameState = 0;
          			status.push("Postponed");
          			break;
        		case "7":  //delayed
        		case "17": //rain delay
          			gameState = 1;
          			classes.push["delay"];
          			status.push("Delay");
          			break;
        		case "8": //suspended
          			gameState = 0;
          			status.push("Suspended");
          			break;
        		case "22": //end period
        		case "48": //SOCCER end extra time
          			gameState = 1;
          			status.push("END");
          			status.push(this.getPeriod(league, game.status.period));
          			break;
        		case "23": //halftime
          			gameState = 1;
          			status.push("HALFTIME");
          			break;
        		case "49": //SOCCER extra time half time
          			gameState = 1;
          			status.push("HALFTIME (ET)");
          			break;
        		case "28": //SOCCER Full Time
          			gameState = 2;
          			status.push("Full Time " + this.getFinalOT(league, game.status.period));
          			break;
        		case "45": //SOCCER Final ET
        		case "46": //SOCCER final score - after golden goal
          			gameState = 2;
          			status.push("Full Time (ET)");
          			break;
        		case "47": //Soccer Final PK
          			gameState = 2;
          			status.push("Full Time (PK) " + this.getFinalPK(hTeamData,vTeamData));
          			break;
        		default: //Anything else, treat like a game that hasn't started yet
          			gameState = 0;
          			status.push(moment(game.competitions[0].date).tz(localTZ).format("h:mm a"));
          			break;

      		}

      /*
        WTF...
        for NCAAF, sometimes FCS teams (I-AA) play FBS (I-A) teams.  These are known as money
        games. As such, the logos directory contains images for all of the FCS teams as well
        as the FBS teams.  Wouldn't you know it but there is a SDSU in both divisions --
        totally different schools!!!
        So we'll deal with it here.  There is an SDSU logo file with a space at the end of
        its name (e.g.: "SDSU .png" that is for the FCS team.  We'll use that abbreviation
        which will load a different logo file, but the extra space will collapse in HTML
        when the short code is displayed).

        The big irony here is that the SAME school as the FCS SDSU has a different ESPN short
        code for basketball: SDST.
      */

      		if (league == "NCAAF" && hTeamData.team.abbreviation == "SDSU" && hTeamData.team.location.indexOf("South Dakota State") != -1) {
        		hTeamData.team.abbreviation = "SDSU ";
      		} else if (league == "NCAAF" && vTeamData.team.abbreviation == "SDSU" && vTeamData.team.location.indexOf("South Dakota State") != -1) {
        		vTeamData.team.abbreviation = "SDSU ";
      		}

      		//determine which display name to use
      		var hTeamLong = "";
      		var vTeamLong = "";
      		//For college sports, use the displayName property
      		if (league == "NCAAF" || league == "NCAAM") {
        		hTeamLong = (hTeamData.team.abbreviation == undefined ? "" : hTeamData.team.abbreviation + " ") + hTeamData.team.name;
        		vTeamLong = (vTeamData.team.abbreviation == undefined ? "" : vTeamData.team.abbreviation + " ") + vTeamData.team.name;
      		} else { //use the shortDisplayName property
        		hTeamLong = hTeamData.team.shortDisplayName;
        		vTeamLong = vTeamData.team.shortDisplayName;
      		}

      		formattedGamesList.push({
        		classes: classes,
        		gameMode: gameState,
        		hTeam: hTeamData.team.abbreviation == undefined ? hTeamData.team.name.substring(0,4).toUpperCase() + " " : hTeamData.team.abbreviation,
        		vTeam: vTeamData.team.abbreviation == undefined ? vTeamData.team.name.substring(0,4).toUpperCase() + " " : vTeamData.team.abbreviation,
        		hTeamLong: hTeamLong,
        		vTeamLong: vTeamLong,
        		hTeamRanking: (league == "NCAAF" || league == "NCAAM") ? this.formatT25Ranking(hTeamData.curatedRank.current) : null,
        		vTeamRanking: (league == "NCAAF" || league == "NCAAM") ? this.formatT25Ranking(vTeamData.curatedRank.current) : null,
        		hScore: parseInt(hTeamData.score),
        		vScore: parseInt(vTeamData.score),
        		status: status,
        		hTeamLogoUrl: hTeamData.team.logo ? hTeamData.team.logo : "",
        		vTeamLogoUrl: vTeamData.team.logo ? vTeamData.team.logo : "",
        		name: null
      			});

    		});
    }
    return formattedGamesList;
  },

  /*
    Format special case for match play
  */
  formatGolfMatchPlay: function(eventData, eventName, teams) {
    var competitors = eventData.competitors;
    var gamesList = new Array();
    var classes = [];
    var status = [];
    var headshot = [];
    var name = [];
    var gameState = competitors[0].status.type.id;
    status.push(eventData.status.type.description);
    var score0 = eventData.competitors[0].score.displayValue;
    var score1 = eventData.competitors[1].score.displayValue;
    var hole = eventData.competitors[0].status.thru;
    //not started yet
    if(hole == "0") {
      hole = "-";
      score = "AS";
    }

    for(var i=0; i<2; i++) {
      for(var j=0; j<2; j++) {
        if(typeof competitors[i].roster[j].athlete.headshot === 'undefined') {
          headshot.push("http://localhost:8080/modules/MMM-MyScoreboard/logos/GOLF/" + teams + ".png");
        } else {
          headshot.push(competitors[i].roster[j].athlete.headshot.href);
        }
        name.push(competitors[i].roster[j].athlete.lastName);
      }
    }

    gamesList.push({
      classes: classes,
      gameMode: gameState,
      hTeam: name[0],
      vTeam: name[1],
      hTeamLong: name[0]+"-"+name[1],
      vTeamLong: name[1],
      hTeamRanking: null,
      vTeamRanking: null,
      hScore: hole,
      vScore: score0,
      status: status,
      hTeamLogoUrl: headshot[1],
      vTeamLogoUrl: headshot[0],
      name: eventName
    });
    gamesList.push({
      classes: classes,
      gameMode: gameState,
      hTeam: name[2],
      vTeam: name[3],
      hTeamLong: name[2]+"-"+name[3],
      vTeamLong: name[3],
      hTeamRanking: null,
      vTeamRanking: null,
      hScore: "",
      vScore: score1,
      status: status,
      hTeamLogoUrl: headshot[3],
      vTeamLogoUrl: headshot[2],
      name: eventName
    });
    return gamesList;
  },

  /*
    Format normal stroke play
  */
  formatGolfStrokePlay: function(eventData, eventName, teams) {
    var competitors = eventData.competitors;
    var gamesList = new Array();

    if(competitors.length > 2) {
      //sort top 10
      competitors.sort((a,b) => (a.sortOrder - b.sortOrder));
      for(var i=0; i<10; i++) {
        var status = [];
        var classes = [];
        var name = competitors[i].athlete.displayName;
        var score = "E";
        if(competitors[i].statistics.length > 0) {
          score = competitors[i].statistics[0].displayValue;
        }
        var day = competitors[i].status.period;
        if(day > 4) {
	        day = 5;
	      }
        var hole = (competitors[i].status.thru == undefined ? competitors[i].status.displayValue : competitors[i].status.thru);
        //double check for undefined
        if(typeof hole === 'undefined') {
          hole = "-";
        }
        if((day>1) && ((hole == "0") || (hole == "18") || (hole == "F"))) {
          //final score of the day if available
          hole = (competitors[i].linescores == undefined ? "F" : competitors[i].linescores[day-2].value);
        }
        else if(hole == "0") { hole = "-";} //not started yet
        var gameState = 0;
        var headshot;
        if(typeof competitors[i].athlete.headshot === 'undefined') {
          headshot = "http://localhost:8080/modules/MMM-MyScoreboard/logos/GOLF/" + teams + ".png";
        } else {
          headshot = competitors[i].athlete.headshot.href;
        }
        // set player state, playing or finished
        switch (competitors[i].status.type.id) {
          case "1" : //in progress
            gameState = 1;
            status.push(competitors[i].status.type.description);
          break;
          case "2" : //complete
            gameState = 2;
            status.push(competitors[i].status.type.description);
          break;
          default:  //scheduled
            gameState = 0;
            status.push(competitors[i].status.type.description);
          break;
        }

        gamesList.push({
          classes: classes,
          gameMode: gameState,
          hTeam: name,
          vTeam: "",
          hTeamLong: name,
          vTeamLong: "",
          hTeamRanking: null,
          vTeamRanking: null,
          hScore: hole,
          vScore: score,
          status: status,
          hTeamLogoUrl: "",
          vTeamLogoUrl: headshot,
          name: eventName
        });
      }
    }
    return gamesList;
  },

  formatT25Ranking: function(rank) {
    if (rank >= 1 && rank <= 25) {
      return rank;
    }
    return null;
  },

  getOrdinal: function(p) {

    var mod10 = p % 10;
    var mod100 = p % 100;

    if (mod10 == 1 && mod100 != 11) {
      return p + "<sup>ST</sup>";
    }
    if (mod10 == 2 && mod100 != 12) {
      return p + "<sup>ND</sup>";
    }
    if (mod10 == 3 && mod100 != 13) {
      return p + "<sup>RD</sup>";
    }

    return p + "<sup>TH</sup>";

  },

  getPeriod: function(league, p) {

    //check for overtime, otherwise return ordinal
    if (this.isSoccer(league)) {

      if (p > 2) {
        return "ET";
      } else {
        return ""; //no need to indicate first or second half
      }
    } else if(league == "MLB") {
      return p;
    } else {
      if (p == 5) {
        return "OT";
      } else if (p > 5) {
        return (p - 4) + "OT";
      }
    }

    return this.getOrdinal(p);

  },

  getFinalOT: function(league, p) {

    if (this.isSoccer(league) && p > 2) {
      return " (ET)";
    } else if(league == "MLB") {
      if (p>9) {
        return " ("+p+")";
      } else {
        return "";
      }
    } else if (!this.isSoccer(league)) {
      if (p == 5) {
        return " (OT)";
      } else if (p > 5) {
        return " (" + (p - 4) + "OT)";
      }
    }

    return "";
  },

  getFinalPK: function (hTeamData,vTeamData) {
    return hTeamData.shootoutScore + "x" + vTeamData.shootoutScore;
  },

  isSoccer: function(league) {
    return (this.SOCCER_LEAGUES.indexOf(league) !== -1);
  }


};
