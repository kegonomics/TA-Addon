chrome.storage.sync.get(null, function(retVal) {
//	console.log("retVal: ", retVal);

	if (retVal["boostSessionTable"]) { // If user has option enabled
		if ($("form#frm").attr("action").match(/gamingsession\.aspx/)[0]) { // Checks if page is a boosting session
			if ($(".sessionachievements .friendfeeditem span a[href$='achievement.htm'").length > 1) { // Checks for more than 1 achievement
				$("#h1Messages").before("<div id=\"boostAchievementTable\" class=\"xb\"><a id=\"boostAchievementTableButton\" class=\"xbbutton\" href=\"#\">View This Session's Achievement Matrix</a></div>");
				
				// On click, do this
				$("#main .session").on("click","#boostAchievementTableButton",function(event) {
					event.preventDefault();
					
					$("#boostAchievementTable").empty().append("<div class=\"spinner\">Loading<br/><div class=\"bounce1\"></div><div class=\"bounce2\"></div><div class=\"bounce3\"></div><div class=\"bounce4\"></div></div>");

					setTimeout(function(){
						// Get achievement info
						// 0 = Achievement ID
						// 1 = Achievement name
						// 2 = Achievement Link
						var sessionAchievements = $(".sessionachievements .friendfeeditem span a[href$='achievement.htm'");

						for (i=0;i<sessionAchievements.length;i++) {
							sessionAchievements[i] = [
								sessionAchievements[i].href.match(/(a\d*)(?=\/)/)[0].match(/\d.*/)[0],
								sessionAchievements[i].text,
								sessionAchievements[i].href
							];
						}

						// Get gamers in session
						// 0 = Gamertag
						// 1 = Gamer achievements link for game
						// 2 = Gamers achievement completions for session (true/false)
						var gamerLinks = $("#oGamingSessionGamerList .gamer a");
						var gamers = [];
						var n = 0;

						for (i=0;i<gamerLinks.length;i++) {
							if (gamerLinks[i].href.match(/achievements\.htm/)) {
								gamers[n] = [
									gamerLinks[i].text,
									gamerLinks[i].href,
									[]
								];
								n++;
							}
						}

						// Get Achievement Completion for Gamers
						for (i=0;i<gamers.length;i++) {
							var html = $("#main",$.ajax({type: "GET", url: gamers[i][1], async: false}).responseText);

							// Checks if player has unlocked achievements shown on achievements page
							var achView = 0; // 0 = Green, 1 = Red, 2 = Both

							if ($(html).find(".achievementpanel.green").length) {
								if ($(html).find(".achievementpanel.red").length) {
									achView = 2;
								} else {
									achView = 0;
								}
							} else {
								achView = 1;
							}

							// Gets unlocked status for session achievements
							for (x=0;x<sessionAchievements.length;x++) {
								if (achView) { // If red achievements are on page
									if ($(html).find("#ap" + sessionAchievements[x][0]).hasClass("red")) { // If achievement is red
										gamers[i][2][x] = 0;
									} else {
										gamers[i][2][x] = 1;
									}
								} else { // If only green achievements are on page
									if ($(html).find("#ap" + sessionAchievements[x][0]).hasClass("green")) { // If achievement is green
										gamers[i][2][x] = 1;
									} else {
										gamers[i][2][x] = 2;
									}
								}
							}
						}

						// Create table HTML
						var achTable = "<table class=\"maintable\">"+
									"<thead>"+
										"<tr>";

						// Build columns for each achievement
						for (i=0;i<sessionAchievements.length;i++) {
							achTable +=		"<th>"+
												"<div class=\"vertical-text\"><a href=\""+
													sessionAchievements[i][2]+
												"\">"+
													sessionAchievements[i][1]+
												"</a></div>"+
											"</th>";
						}
											
						achTable +=			"<th>"+
												"&nbsp;"+
											"</th>"+
										"</tr>"+
									"</thead>"+
									"<tbody>"+
										"<tr>";

						// Build rows for each gamer
						for (i=0;i<gamers.length;i++) {
							achTable +=	"<tr";
							if (i%2) {
								achTable += " class=\"even show\"";
							} else {
								achTable += " class=\"odd show\"";
							}
							achTable +=	">";

							// Fill each column for the gamer
							for (x=0;x<gamers[i][2].length;x++) {
								achTable +=	"<td";

								if (gamers[i][2][x]) {
									achTable += " class=\"green locked\"><span/>";
								} else {
									achTable +=	" title=\"Toggle Achievement Status\" class=\"red unlocked\"><span/>";
								}
												
								achTable +=	"</td>";
							}
											
								achTable += "<td title=\"Toggle No-Show\">"+
												gamers[i][0]+
											"</td>"+
										"</tr>";
						}
						
						achTable +=	"</tbody>"+
								"</table>";
						
						// Draw table
						$("#boostAchievementTable").empty().append(achTable);

						// Toggle table cells unlocked/locked achievement
						$("#boostAchievementTable td.unlocked").on('click', function(e) {
							$(this).toggleClass("red green");
						});

						// Toggle player as show/no-show
						$("#boostAchievementTable tr.show td:last-child").on('click', function(e) {
							$(this).parent().toggleClass("show noShow");
						});
					}, 500);
				});
			}
		}
	}
});