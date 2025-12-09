jQuery(document).ready(function ($) {
	//////////////////////////////////
	//////////////////////////////////
	//////////////////////////////////
	//////////////////////////////////
	// product cards js section

	$homeTitle = "Marathon Equipment Inc – Asphalt Maintenance Equipment";
	$getTitle = $("title").text();
	if ($getTitle == $homeTitle) {
		$dID = "home";
	} else {
		$dID = "category";
	}
	// localHost access -> "json/modelsDatabase.json"
    // remote -> "https://jovaughnro.github.io/Interactive-Product-Card-Demo/json/modelsDatabase.json"
	$.getJSON("https://jovaughnro.github.io/Interactive-Product-Card-Demo/json/modelsDatabase.json", function (data) {
		$masterOModels = data;
	});
    
	maincontroller();
	function maincontroller() {
		// when the tank capacity buttons are clicked
		$(".bgtc-class")
			.children()
			.on("click", function () {
				// $modelSeriesId = mobileidDatabase($selectModel); // gets the model family ie: MM
				$id = $(this).attr("id");
				$model = $id.split("Btn")[0];

				updateMachineModels($model); // gets the selected product then print it out on screen.
				activemobiletable($model);
				$btnGroup = $("#" + $id).parent();

				// this toggle the active button color for the tank capacity
				$("#" + $btnGroup.attr("id"))
					.children()
					.removeClass("act");
				$("#" + $id).addClass("act");
			});

		$viewID = $("main").attr("id");

		windowWidth();
		function windowWidth() {
			$intiwindowWidth = $(window).width();
			switchSpecFormat($intiwindowWidth);
			$resizeWidth = $(window).resize(function () {
				$windowWidth = $(window).width(); // New width
				switchSpecFormat($windowWidth);
			});
			function switchSpecFormat($winWidth) {
				if ($winWidth <= 590) {
					$("button.SpecBox").removeAttr("data-bs-toggle").removeAttr("data-bs-target");
					$("button.SpecBox").each(function () {
						$modelAcro = this.id.split("Specs")[0];

						if ($modelAcro.slice(-2) == "dt") {
							$modelAcro = $modelAcro.slice(0, -2);
							// code above will remove the string elements 'dt' from the $modelAcro string
							// when the user selects the diesel button. it changes the specs button id to access the diesel modal table
							// but when the page is resize to the mobile version. the specs button not be able to access the collapse container
							// as it's id is:
							// <div class="collapse my-3" id="collapseld_Specs">
							// so remove the dt and get just 'ld'
						}
						$("#" + this.id).attr({
							"data-bs-toggle": "collapse",
							"data-bs-target": "#collapse" + $modelAcro + "_Specs",
							"aria-expanded": "false",
							"aria-controls": "collapse" + $modelAcro + "_Specs",
						});
					});
				} else {
					$("button.SpecBox")
						.removeAttr("data-bs-toggle")
						.removeAttr("data-bs-target")
						.removeAttr("aria-expanded")
						.removeAttr("aria-controls");

					$("button.SpecBox").each(function () {
						$("#" + this.id).attr({
							"data-bs-toggle": "modal",
							"data-bs-target": "#specsModalTable",
						});
					});
					$("div.my-3.collapse").removeClass("show"); // this is a problem that cause the dissapperance
				}
			}
		}
		dtptBtn(); // swaps the diesel fired and propane fired models.
		function dtptBtn() {
			$(document).on("click", ".ptdtBtn", function () {
				// toggle the class names to show if either propane or diesel is active.
				$(this).removeClass("ptdtBtn").siblings().addClass("ptdtBtn").parent().children().removeClass("ptdtBtnActive");
				$(this).addClass("ptdtBtnActive");
				$parentBtnIDAcronym = $(this).parent().attr("id").split("-bt-models")[0];

				$btnGroupTankCap = $("#" + $parentBtnIDAcronym.toUpperCase() + "btnGroupTankCapacity");

				$acroBT = $(this).attr("id").slice(-2); // gets the last 2 characters of the propane or diesel id string. acroBT, acronym button

				switch ($acroBT) {
					case "DT":
						$btns = $btnGroupTankCap.children();
						$btns.each(function () {
							$currentId = $(this).attr("id");
							// Replace 'PT' with 'DT' in the id
							$newId = $currentId.replace("PT", "DT");
							// Set the new id back to the element
							$(this).attr("id", $newId);
						});
						switch ($parentBtnIDAcronym) {
							case "ucmk":
								$("button#ucmkSpecs").attr("id", "ucmkdtSpecs");
								$("div#UCMKDT_Specscontainer")
									.removeClass("d-none")
									.end()
									.find("div#UCMKPT_Specscontainer")
									.addClass("d-none");
								break;
							case "keb":
								$("button#kebSpecs").attr("id", "kebdtSpecs");
								$("button#KEB115DTBtn").addClass("d-none");
								if ($("button#KEB115DTBtn").hasClass("act")) {
									$("button#KEB260DTBtn").trigger("click");
								}
								$("div#KEBDT_Specscontainer")
									.removeClass("d-none")
									.end()
									.find("div#KEBPT_Specscontainer")
									.addClass("d-none");
								break;
							case "ld":
								$("button#ldSpecs").attr("id", "lddtSpecs");
								$("div#LDDT_Specscontainer")
									.removeClass("d-none")
									.end()
									.find("div#LDPT_Specscontainer")
									.addClass("d-none");
								break;
						}
						break;
					case "PT":
						$btns = $btnGroupTankCap.children();
						$btns.each(function () {
							$currentId = $(this).attr("id");
							// Replace 'PT' with 'DT' in the id
							$newId = $currentId.replace("DT", "PT");
							// Set the new id back to the element
							$(this).attr("id", $newId);
							switch ($parentBtnIDAcronym) {
								case "ucmk":
									$("button#ucmkdtSpecs").attr("id", "ucmkSpecs");
									$("div#UCMKPT_Specscontainer")
										.removeClass("d-none")
										.end()
										.find("div#UCMKDT_Specscontainer")
										.addClass("d-none");
									break;
								case "keb":
									$("button#kebdtSpecs").attr("id", "kebSpecs");
									$("button#KEB115PTBtn").removeClass("d-none");
									$("div#KEBPT_Specscontainer")
										.removeClass("d-none")
										.end()
										.find("div#KEBDT_Specscontainer")
										.addClass("d-none");
									break;
								case "ld":
									$("button#lddtSpecs").attr("id", "ldSpecs");
									$("div#LDPT_Specscontainer")
										.removeClass("d-none")
										.end()
										.find("div#LDDT_Specscontainer")
										.addClass("d-none");
									break;
							}
						});
						break;
				}
				$btnGroupTankCap.children(".act").trigger("click"); // this allows the product card to switch to model of the selected burner type.
			});
		}
	}
	function modelSwitch($modelTitle, $commonTitle, $bl, $tc, $bt, $ft, $img, $desc, $learn, $inquiry, $alt, $category) {
		this.$modelTitle = $modelTitle;
		this.$commonTitle = $commonTitle;
		this.$bl = $bl;
		this.$tc = $tc;
		this.$bt = $bt;
		this.$ft = $ft;
		this.$img = $img;
		this.$desc = $desc;
		this.$alt = $alt;
		this.$learn = $learn;
		this.$inquiry = $inquiry;
		this.$category = $category;
		this.update = function () {
			document.getElementById($category + "-modelId").innerHTML = "Model: " + this.$modelTitle;
			// hot fix for ucmk pt and dt brochure
			switch (this.$modelTitle) {
				case "UCMK130PT":
				case "UCMK230PT":
				case "UCMK370PT":
					document.getElementById("ucmk-broc").href =
						"https://marathonequipmentinc.com/wp-content/uploads/2025/09/marathon-equipment-inc-ucmkpt-brochure.pdf";
					break;
				case "UCMK130DT":
				case "UCMK230DT":
				case "UCMK370DT":
					document.getElementById("ucmk-broc").href =
						"https://marathonequipmentinc.com/wp-content/uploads/2023/10/marathon-equipment-inc-ucmkdt-brochure.pdf";
					break;
				
			}
			if (this.$modelTitle == "DPS9") {
				document.getElementById($category + "-modelSpesc").innerHTML = this.$ft;
				// we are going to add brochure change for the dps here make sure to call the id dps-broc
				// switch dps9 brochure
				document.getElementById('dps-broc').href = "https://marathonequipmentinc.com/wp-content/uploads/2022/04/marathon-equipment-inc-dps9-brochure.pdf";
			} else if (this.$modelTitle == "DPS550T") {
				document.getElementById($category + "-modelSpesc").innerHTML =
					this.$tc + " | " + this.$bt + " | " + this.$ft;
					// switch dps550t brochure 
					document.getElementById('dps-broc').href = "https://marathonequipmentinc.com/wp-content/uploads/2025/06/marathon-equipment-inc-dps550t-brochure.pdf";
			} else if (this.$modelTitle != "DPS550T" && this.$modelTitle != "DPS9") {
				switch ($category) {
					case "cr":
					case "rcr":
					case "hepr":
						document.getElementById($category + "-modelSpesc").innerHTML =
							this.$tc + " | " + this.$bt + " | " + this.$ft;
						break;						
					default:
						if (this.$tc == "N/A" && this.$bt != "N/A") {
							document.getElementById($category + "-modelSpesc").innerHTML = this.$bt + "-Fired | " + this.$ft;
						} else if (this.$tc == "N/A" && this.$bt == "N/A") {
							document.getElementById($category + "-modelSpesc").innerHTML = this.$ft;
						} else if (this.$tc != "N/A" && this.$bt == "N/A") {
							document.getElementById($category + "-modelSpesc").innerHTML = this.$tc + " | " + this.$ft;
						} else if (this.$tc != "N/A" && this.$bt != "N/A") {
							document.getElementById($category + "-modelSpesc").innerHTML =
								this.$tc + " | " + this.$bt + "-Fired | " + this.$ft;
						}
						break;
				}
			}
			if (this.$bl != "*") {
				document.getElementById("desktop-" + $category + "-bl-link").href = this.$bl;
			}
			document.getElementById($category + "-ModelTitle").innerHTML = this.$commonTitle;
			document.getElementById($category + "ProductDescrip").innerHTML = this.$desc;
			document.getElementById($category + "-LM").href = this.$learn;
			document.getElementById($category + "-gaq").href = this.$inquiry;
			document.getElementById($category + "-imgDisplay").src = this.$img;
			document.getElementById($category + "-imgDisplay").alt = this.$alt;
		};
	}

	function loadCards($name, $title, $bl, $tc, $bt, $ft, $img, $descp, $alt, $link, $iqLink) {
		this.$name = $name;
		this.$title = $title;
		this.$bl = $bl;
		this.$tc = $tc;
		this.$bt = $bt;
		this.$ft = $ft;
		this.$img = $img;
		this.$descp = $descp;
		this.$alt = $alt;
		this.$link = $link;
		this.$iqLink = $iqLink;
		this.update = function ($modelSeriesId) {
			//desktop version
			document.getElementById("desktop-" + $modelSeriesId + "-productTitle").innerHTML = this.$title;
			document.getElementById("desktop-" + $modelSeriesId + "-tc").innerHTML = this.$tc;
			document.getElementById("desktop-" + $modelSeriesId + "-bt").innerHTML = this.$bt;
			document.getElementById("desktop-" + $modelSeriesId + "-ft").innerHTML = this.$ft;
			document.getElementById("desktop-" + $modelSeriesId + "-productInfo").innerHTML = this.$descp;
			document.getElementById("desktop-" + $modelSeriesId + "-imgDisplay").src = this.$img;
			document.getElementById("desktop-" + $modelSeriesId + "-imgDisplay").alt = this.$alt;
			document.getElementById($modelSeriesId + "-lm-link").href = this.$link;
			if (this.$bl != "*") {
				document.getElementById("desktop-" + $modelSeriesId + "-bl-link").href = this.$bl;
			}
			document.getElementById("desktop-" + $modelSeriesId + "-inquiy-link").href = this.$iqLink;
			//mobile version
			document.getElementById("mobile-" + $modelSeriesId + "-productTitle").innerHTML = this.$title;
			document.getElementById("mobile-" + $modelSeriesId + "-tc").innerHTML = this.$tc;
			document.getElementById("mobile-" + $modelSeriesId + "-bt").innerHTML = this.$bt;
			document.getElementById("mobile-" + $modelSeriesId + "-ft").innerHTML = this.$ft;
			document.getElementById("mobile-" + $modelSeriesId + "-productInfo").innerHTML = this.$descp;
			document.getElementById("mobile-" + $modelSeriesId + "-imgDisplay").src = this.$img;
			document.getElementById("mobile-" + $modelSeriesId + "-imgDisplay").alt = this.$alt;
			document.getElementById($modelSeriesId + "-lm-link-mobile").href = this.$link;
			if (this.$bl != "*") {
				document.getElementById("mobile-" + $modelSeriesId + "-bl-link").href = this.$bl;
			}
			document.getElementById("mobile-" + $modelSeriesId + "-inquiy-link").href = this.$iqLink;
			// document.getElementById(dID.Img_ID).alt = this.$alt;
			// document.getElementById(dID.Descp_ID).innerHTML = this.$descp;
		};
		this.carousel = function ($modelSeriesId) {
			//desktop version
			document.getElementById("desktop-" + $modelSeriesId + "-productTitle-2").innerHTML = this.$title;
			document.getElementById("desktop-" + $modelSeriesId + "-tc-2").innerHTML = this.$tc;
			document.getElementById("desktop-" + $modelSeriesId + "-bt-2").innerHTML = this.$bt;
			document.getElementById("desktop-" + $modelSeriesId + "-ft-2").innerHTML = this.$ft;
			document.getElementById("desktop-" + $modelSeriesId + "-productInfo-2").innerHTML = this.$descp;
			document.getElementById("desktop-" + $modelSeriesId + "-imgDisplay-2").src = this.$img;
			document.getElementById("desktop-" + $modelSeriesId + "-imgDisplay-2").alt = this.$alt;
			document.getElementById($modelSeriesId + "-lm-dt-link").href = this.$link;
			document.getElementById("desktop-" + $modelSeriesId + "-dt-inquiy-link").href = this.$iqLink;
			//mobile version
			document.getElementById("mobile-" + $modelSeriesId + "-productTitle-2").innerHTML = this.$title;
			document.getElementById("mobile-" + $modelSeriesId + "-tc-2").innerHTML = this.$tc;
			document.getElementById("mobile-" + $modelSeriesId + "-bt-2").innerHTML = this.$bt;
			document.getElementById("mobile-" + $modelSeriesId + "-ft-2").innerHTML = this.$ft;
			document.getElementById("mobile-" + $modelSeriesId + "-productInfo-2").innerHTML = this.$descp;
			document.getElementById("mobile-" + $modelSeriesId + "-imgDisplay-2").src = this.$img;
			document.getElementById("mobile-" + $modelSeriesId + "-imgDisplay-2").alt = this.$alt;
			document.getElementById($modelSeriesId + "-lm-dt-link-mobile").href = this.$link;
			document.getElementById("mobile-" + $modelSeriesId + "-dt-inquiy-link").href = this.$iqLink;
		};
	}
	//////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////
	// product cards database section
	function updateMachineModels($selectModel, $dID, $btn_cat) {
		// please note: always include (available:) key to all objects to ensure that the database works.
		// please note: organize data in order  largest of gallon size to the smallest. the 'size' key will represent this value.
        
		if ($dID != "home" && $dID != "mobile") {
            console.log("selectModel =>", $selectModel);
			for ($i = 0; $i < $masterOModels.length; $i++) {
				if ($selectModel == $masterOModels[$i].name) {
					$oModels = new modelSwitch(
						$masterOModels[$i].name,
						$masterOModels[$i].commonTitle,
						$masterOModels[$i].bidLink,
						$masterOModels[$i].tankCapacity,
						$masterOModels[$i].burnerType,
						$masterOModels[$i].frameType,
						$masterOModels[$i].image,
						$masterOModels[$i].descp["default"],
						$masterOModels[$i].learnLink,
						$masterOModels[$i].inquiryLink,
						$masterOModels[$i].alt,
						$masterOModels[$i].category
					);
					$oModels.update();
				}
			}
			
		}
		if ($selectModel != null && $dID == "mobile") {
			for ($i = 0; $i < $masterOModels.length; $i++) {
				if ($selectModel == $masterOModels[$i].name) {
					$mobileModels = new mobileUICards(
						$masterOModels[$i].commonTitle,
						$masterOModels[$i].tankCapacity,
						$masterOModels[$i].burnerType,
						$masterOModels[$i].frameType,
						$masterOModels[$i].image,
						$masterOModels[$i].descp["default"],
						$masterOModels[$i].alt,
						$masterOModels[$i].learnLink,
						$masterOModels[$i].inquiryLink
					);
					$mobileModels.update($modelseriesID);
				}
			}
		}
	}
	function activemobiletable($actveModel) {
		switch ($actveModel) {
			
			case "UCMK65PT":
			case "UCMK130PT":
			case "UCMK230PT":
			case "UCMK370PT":
				$modelseriesID = "UCMKPT_Specscontainer";
				break;
			case "UCMK130DT":
			case "UCMK230DT":
			case "UCMK370DT":
				$modelseriesID = "UCMKDT_Specscontainer";
				break;
			case "KERA180BRE":
			case "KERA270BRE":
			case "KERA370BRE":
				$modelseriesID = "KERA_Specscontainer";
				break;
					
		}
		// changes the display of which mobile table will be displayed
		$("div#" + $modelseriesID)
			.children("table.table")
			.removeClass("t-active")
			.addClass("d-none");
		$("table#" + $actveModel + "Table")
			.removeClass("d-none")
			.addClass("t-active");
		// essentailly all of this means that on selection of DF10W the specs table on mobile will display the specs
		// for DF10W and hides the others until they are selected.
	}	
});


