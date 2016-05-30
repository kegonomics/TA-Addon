// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
	if(details.reason == "install") {
		chrome.storage.sync.set({
			boostSessionTable: true,
			boostSessionTableReplace: false
		  });
	} else if(details.reason == "update"){
	}
});

function createTable(gamers, numTable = 1) {
	var achName = prompt("What is the name of the achievement?");
	var numSteps = prompt("How many steps does this achievement have?");
	var achSteps = [];

	for (var i=0;i<numSteps;i++) {
		if (i==0) {
			achSteps.push(prompt("What is the first step?"));
		} else if (i == (numSteps - 1)) {
			achSteps.push(prompt("What is the last step?"));
		} else {
			achSteps.push(prompt("What is the next step?"));
		}
	}

	var html = "<h1 class=\"block\">"+achName+" // Achievement</h1><table id=\"customTable"+numTable+"\" class=\"maintable disable-selection\"><thead><tr>";

	for (var i=0;i<numSteps;i++) {
		html += "<th><div class=\"vertical-text step"+i+"\"><span>"+achSteps[i]+"</span></div></th>";
	}

	html += "<th></th></tr></thead><tbody>";

	for (var i=0;i<gamers.length;i++) {
		html += "<tr";
		if (i%2) {
			html += " class=\"even show\"";
		} else {
			html += " class=\"odd show\"";
		}
		html += ">";

		for(var x=0;x<numSteps;x++) {
			html += "<td title=\"Toggle Step Status\" class=\"red unlocked\"><span/></td>";
		}

		html += "<td title=\"Toggle No-Show\">"+gamers[i][0]+"</td></tr>";
	}

	html += "</tbody></table>";

	// Draw table
	$("#customTable").before(html);

	var thWidth = [];
	for (var i=0;i<numSteps;i++) {
		thWidth.push($("#customTable"+numTable+" .step"+i).width());
	}

	thWidth = thWidth.sort(function (a, b) {  return a - b;  });

	$("#customTable"+numTable+" th:first-child").css("height",thWidth[thWidth.length - 1] * .7);
	$("#customTable"+numTable+" .vertical-text").css("width",16);

	// Toggle table cells unlocked/locked achievement
	$("#TAAddon td.unlocked").on('click', function(e) {
		$(this).toggleClass("red green");
	});

	// Toggle player as show/no-show
	$("#TAAddon tr.show td:last-child").on('click', function(e) {
		$(this).parent().toggleClass("show noShow");
	});
}

chrome.storage.sync.get(null, function(retVal) {
	if (retVal["boostSessionTable"]) { // If user has option enabled
		if ($("form#frm").attr("action").match(/gamingsession\.aspx/)[0]) { // Checks if page is a boosting session
			$("#h1Messages").before("<div id=\"TAAddon\"></div>");
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

			if ($(".sessionachievements .friendfeeditem span a[href$='achievement.htm'").length > 1) { // Checks for more than 1 achievement
				$("#TAAddon").prepend("<div id=\"boostAchievementTable\" class=\"xb\"><a id=\"boostAchievementTableButton\" class=\"xbbutton\" href=\"#\">Build This Session's Achievement Table</a></div>");
				
				// On click, do this
				$("#main .session").on("click","#boostAchievementTableButton",function(event) {
					event.preventDefault();
					
					$("#boostAchievementTable").empty().before("<h1 class=\"block\">Achievement Table</h1>").append("Generating Table<br/><i>The page may appear to be frozen while the table is generated.<br/>Thank you for your patience!</i><div class=\"spinner\"><div class=\"bounce1\"></div><div class=\"bounce2\"></div><div class=\"bounce3\"></div><div class=\"bounce4\"></div></div>");

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

						if (retVal["boostSessionTableReplace"]) {
							$('h1:contains("Gamers in session")').remove();
							$("#oGamingSessionGamerListHolder").remove();
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
						var achTable = "<table class=\"maintable disable-selection\">"+
									"<thead>"+
										"<tr>";

						// Build columns for each achievement
						for (i=0;i<sessionAchievements.length;i++) {
							achTable +=		"<th>"+
												"<div class=\"vertical-text ach"+i+"\"><a href=\""+
													sessionAchievements[i][2]+
												"\" target=\"_blank\">"+
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

						var thWidth = [];
						for (var i=0;i<sessionAchievements.length;i++) {
							thWidth.push($("#boostAchievementTable .ach"+i).width());
						}

						thWidth = thWidth.sort(function (a, b) {  return a - b;  });

						$("#boostAchievementTable th:first-child").css("height",thWidth[thWidth.length - 1] * .7);
						$("#boostAchievementTable .vertical-text").css("width",16);

						// Toggle table cells unlocked/locked achievement
						$("#TAAddon td.unlocked").on('click', function(e) {
							$(this).toggleClass("red green");
						});

						// Toggle player as show/no-show
						$("#TAAddon tr.show td:last-child").on('click', function(e) {
							$(this).parent().toggleClass("show noShow");
						});
					}, 500);
				});
			} // if achievements is more than 1

			$("#TAAddon").append("<div id=\"customTable\" class=\"xb\"><a id=\"customTableButton\" class=\"xbbutton blue\" href=\"#\">Create a Table for an Achievement w/ Multiple Steps</a></div>");

			var numTable = 1;

			// On click, do this
			$("#main .session").on("click","#customTableButton",function(event) {
				event.preventDefault();

				createTable(gamers,numTable);
				numTable++;
			});
		}
	}
});
