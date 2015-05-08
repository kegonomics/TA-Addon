
/*// If this option is set to on
chrome.storage.sync.get({
	xbaLink: true
});

// Run this code

$(".smallpanel.panelnavy:contains('External links:')").append("<div id='xba'><a id='xbabutton' href='#'>View Game on XboxAchievements.com</a></div>");
*/

chrome.storage.sync.get(null, function(retVal) {
	console.log("retVal: ", retVal);

	if (retVal["boostSessionTable"]) {
		if ($("#oTitle.pagetitle:contains('Gaming Session Details')")) {
			//$(".buttons .clearboth").before("<a class=\"button\" href=\"#\" id=\"btnAchievementTable\" onclick=\"renderAchievementTable();\">Achievement Table</a>");

			// Get achievement info
			// 0 = Achievement ID
			// 1 = Achievement name
			var sessionAchievements = $(".sessionachievements .friendfeeditem span a[href$='achievement.htm'");
			console.log("Session Achivements: " + sessionAchievements.length);

			for (i=0;i<sessionAchievements.length;i++) {
				sessionAchievements[i] = [sessionAchievements[i].href.match(/(a\d*)(?=\/)/g),sessionAchievements[i].text];
			}
			console.log(sessionAchievements);

			// Get gamers in session
			// 0 = Gamertag
			// 1 = Gamer achievements link for game
			// 2 = Gamers achievement completions for session (true/false)
			var gamers = $("#oGamingSessionGamerList .gamer a");
			var numGamers = $("#oGamingSessionGamerList .gamer").length;
			console.log("Gamers: " + numGamers);

			for (i=0;i<numGamers;i++) {
				gamers[i] = [
					gamers[i].text,
					gamers[i].href,
					[]
				];
				gamers.splice(i+1,2);
			}
			console.log(gamers);

			// Get Achievement Completion for Gamers
			$.get(gamers[0][1], function(data) {
				html = $("#main", $(data));
			});

			console.log(html);

			// Draw table
			/*$("#h1Messages").before(""+
				"<div id=\"boostAchievementTable\">"+
					"<table class=\"maintable\">"+
						"<thead>"+
							"<tr>"+
								"<th>"+
									"&nbsp;"+
								"</th>"+
								"<th>"+
									"<div class=\"vertical-text\"><a href=\"\">Planting a Flag</a></div>"+
								"</th>"+
								"<th>"+
									"<div class=\"vertical-text\"><a href=\"\">Roadkill Rampage</a></div>"+
								"</th>"+
								"<th>"+
									"<div class=\"vertical-text\"><a href=\"\">Rock and Coil Hit Back</a></div>"+
								"</th>"+
								"<th>"+
									"<div class=\"vertical-text\"><a href=\"\">Spree Master</a></div>"+
								"</th>"+
								"<th>"+
									"<div class=\"vertical-text\"><a href=\"\">The True King</a></div>"+
								"</th>"+
								"<th>"+
									"<div class=\"vertical-text\"><a href=\"\">Domination</a></div>"+
								"</th>"+
								"<th>"+
									"<div class=\"vertical-text\"><a href=\"\">Double Trouble</a></div>"+
								"</th>"+
								"<th>"+
									"<div class=\"vertical-text\"><a href=\"\">Party Pooper</a></div>"+
								"</th>"+
							"</tr>"+
						"</thead>"+
						"<tbody>"+
							"<tr class=\"even\">"+
								"<td>"+
									"<a href=\"\"><img class=\"smallicon\" src=\"http://im5.trueachievements.com/imagestore/thumbs/0001327900/1327924.jpg\"/> Player 1</a>"+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
							"</tr>"+
							"<tr class=\"odd\">"+
								"<td>"+
									"<a href=\"\"><img class=\"smallicon\" src=\"http://im10.trueachievements.com/imagestore/thumbs/0001144900/1144909.jpg\"/> Player 2</a>"+
								"</td>"+
								"<td>"+
									"<i class=\"fa fa-check\"></i>"+
								"</td>"+
								"<td>"+
									"<i class=\"fa fa-check\"></i>"+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									"<i class=\"fa fa-check\"></i>"+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									"<i class=\"fa fa-check\"></i>"+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
							"</tr>"+
							"<tr class=\"even\">"+
								"<td>"+
									"<a href=\"\"><img class=\"smallicon\" src=\"http://im1.trueachievements.com/imagestore/thumbs/0001682200/1682200.png\"/> Player 3</a>"+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
							"</tr>"+
							"<tr class=\"odd\">"+
								"<td>"+
									"<a href=\"\"><img class=\"smallicon\" src=\"http://im1.trueachievements.com/imagestore/thumbs/0001048400/1048420.jpg\"/> Player 4</a>"+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
							"</tr>"+
							"<tr class=\"even\">"+
								"<td>"+
									"<a href=\"\"><img class=\"smallicon\" src=\"http://im9.trueachievements.com/imagestore/thumbs/0001258600/1258608.jpg\"/> Player 5</a>"+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
							"</tr>"+
							"<tr class=\"odd\">"+
								"<td>"+
									"<a href=\"\"><img class=\"smallicon\" src=\"http://im9.trueachievements.com/imagestore/thumbs/0001598700/1598748.jpg\"/> Player 6</a>"+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
								"<td>"+
									""+
								"</td>"+
							"</tr>"+
						"</tbody>"+
					"</table>"+
				"</div>"
			);*/
		}
	}
});