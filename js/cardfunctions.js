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
    // local host -> "/js/modelsDatabase.json"
	// remote -> "https://marathonequipmentinc.com/wp-content/themes/oceanwp-child/js/modelsDatabase.json"
	$.getJSON("json/modelsDatabase.json", function (data) {
		$masterOModels = data;
	});
    
	maincontroller();
	function maincontroller() {
		// when the tank capacity buttons are clicked
		$(".bgtc-class, .mobile-model-options-ddm")
			.children()
			.on("click", function () {
				// $modelSeriesId = mobileidDatabase($selectModel); // gets the model family ie: MM
				$id = $(this).attr("id");
				$model = $id.split("Btn")[0];
				// console.log($id);
				updateMachineModels($model); // gets the selected product then print it out on screen.
				activemobiletable($model);
				$btnGroup = $("#" + $id).parent();
				// console.log($btnGroup);

				// this toggle the active button color for the tank capacity
				// $("#" + $btnGroup.attr("id"))
				// 	.children()
				// 	.removeClass("act");
				// $("#" + $id).addClass("act");

				// switch to sibilings
				// this toggle the active button color
				$(this).addClass("act");
				$(this).siblings().removeClass("act");
				// if mobile models option is clicked. then make desktop tank capacity button match active color
				if ($(this).attr("id").includes("-Mobile")) {
					$desktopBtn = $id.split("-Mobile")[0];

					$ptordt = $id.split("Btn-Mobile")[0].slice(-2); // PT or DT if button id is KEB500DTBtn-Mobile it gets the substring "DT"
					$mobile_ddm_model_id = $btnGroup.attr("id").split("ddm-mobile-")[1];
					switch ($mobile_ddm_model_id) {
						case "keb":
						case "ld":
						case "ucmk":
							$("button#" + $mobile_ddm_model_id + "Btn" + $ptordt).trigger("click");
							break;
					}
					$("button#" + $desktopBtn).trigger("click");
				} else {
					// if desktop tank capacity buttons are clicked the mobile model option will change the active color to match
					// which tank capacity was selected.
					$("#" + $id + "-Mobile").addClass("act");
					$("#" + $id + "-Mobile")
						.siblings()
						.removeClass("act");
				}
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
							}
						});
						break;
				}
				$btnGroupTankCap.children(".act").trigger("click"); // this allows the product card to switch to model of the selected burner type.
			});
		}
	}
	function modelSwitch(
		$modelTitle,
		$commonTitle,
		$bl,
		$tc,
		$bt,
		$ft,
		$img,
		$desc,
		$learn,
		$inquiry,
		$alt,
		$category,
		$viewBrochureLink,
		$buttonTitle,
	) {
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
		this.$viewBrochureLink = $viewBrochureLink;
		this.$buttonTitle = $buttonTitle;

		//console.log($viewBrochureLink); // <- this works
		this.update = function () {
			document.getElementById($category + "-modelId").innerHTML = "Model: " + this.$modelTitle;
			// hot fix for ucmk pt and dt brochure

			//console.log("GRACO CAT -> ", $category);

			if (this.$modelTitle != "DPS550T" && this.$modelTitle != "DPS9") {
				switch ($category) {
					case "GLVS":
					case "HALS":
						break;
					case "cr":
					case "rcr":
					case "hepr":
						document.getElementById($category + "-modelSpesc").innerHTML =
							this.$tc + " | " + this.$bt + " | " + this.$ft;
						break;

					default:
						if (this.$tc == "N/A" && this.$bt != "N/A") {
							document.getElementById($category + "-modelSpesc").innerHTML = this.$bt + "-Fired | " + this.$ft; // desktop
							document.getElementById($category + "-mobile-modelSpesc").innerHTML = this.$bt + "-Fired | " + this.$ft; //mobile
						} else if (this.$tc == "N/A" && this.$bt == "N/A") {
							document.getElementById($category + "-modelSpesc").innerHTML = this.$ft; // desktop
							document.getElementById($category + "-mobile-modelSpesc").innerHTML = this.$ft; //mobile
						} else if (this.$tc != "N/A" && this.$bt == "N/A") {
							document.getElementById($category + "-modelSpesc").innerHTML = this.$tc + " | " + this.$ft; // desktop
							document.getElementById($category + "-mobile-modelSpesc").innerHTML = this.$tc + " | " + this.$ft; // mobile
						} else if (this.$tc != "N/A" && this.$bt != "N/A") {
							document.getElementById($category + "-modelSpesc").innerHTML =
								this.$tc + " | " + this.$bt + "-Fired | " + this.$ft; // desktop
							document.getElementById($category + "-mobile-modelSpesc").innerHTML =
								this.$tc + " | " + this.$bt + "-Fired | " + this.$ft; //mobile
						}
						break;
				}
			}

			if (this.$bl != "*") {
				document.getElementById("desktop-" + $category + "-bl-link").href = this.$bl;
				document.getElementById("mobile-" + $category + "-bl-link").href = this.$bl;
			}
			document.getElementById($category + "-ModelTitle").innerHTML = this.$commonTitle;
			document.getElementById($category + "ProductDescrip").innerHTML = this.$desc;
			document.getElementById($category + "-LM").href = this.$learn;
			document.getElementById($category + "-gaq").href = this.$inquiry;
			document.getElementById($category + "-imgDisplay").src = this.$img;
			document.getElementById($category + "-imgDisplay").alt = this.$alt;
			switch ($category) {
				case "GLVS":
				case "HALS":
					break;

				default:
					document.getElementById($category + "-brochure").href = this.$viewBrochureLink;
					// For Mobile product cards
					document.getElementById($category + "-mobile-modelId").innerHTML = this.$buttonTitle;
					break;
			}

			switch ($category) {
				case "GLVS":
				case "HALS":
				case "cr":
				case "pas":
					// if the model has no burner or engine type. Do nothing
					break;
				case "pes":
					if (this.$bt == "N/A") {
						document.getElementById($category + "-mobile-bt").innerHTML = "";
						$("#pes-mobile-bt").addClass("d-none");
					} else {
						//console.log($category);
						document.getElementById($category + "-mobile-bt").innerHTML = " | " + this.$bt + "-Fired";
						$("#pes-mobile-bt").removeClass("d-none");
					}
					break;
				default:
					document.getElementById($category + "-mobile-bt").innerHTML = this.$bt + "-Fired";
					break;
			}

			switch ($category) {
				case "GLVS":
				case "HALS":
					break;
				default:
					document.getElementById($category + "-mobile-imgDisplay").src = this.$img;
					document.getElementById($category + "-mobile-imgDisplay").alt = this.$alt;
					document.getElementById($category + "-mobile-ModelTitle").innerHTML = this.$commonTitle;
					document.getElementById($category + "-mobile-LM").href = this.$learn;
					document.getElementById($category + "-mobile-img-learnmore-link").href = this.$learn;
					document.getElementById($category + "-mobile-gaq").href = this.$inquiry;
					break;
			}
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
			// this effects the product cards;
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
						$masterOModels[$i].category,
						$masterOModels[$i].viewBrochureLink,
						$masterOModels[$i].buttonTitle,
					);
					$oModels.update();
				}
			}
			// filters and sorts models based on a selected category - used for the homepage filter system
			// if a category is selected, the results are filtered based on the category and then sorted alphabetically
			if ($selectModel == null && $btn_cat != null) {
				$result = [];
				for ($i = 0; $i < $masterOModels.length; $i++) {
					if ($masterOModels[$i].available.includes($btn_cat) == true) {
						$result.push($masterOModels[$i]);
					}
				}
				// this sorts the results list in alphabetical order based on the name value.
				$result.sort(function ($a, $b) {
					return $a.name.localeCompare($b.name);
				});
				prevCardBuild($result, $btn_cat);
			}
		}
		// updating home page modal
		if ($selectModel != null && $dID == "home") {
			// this loads model info that has both diesel and propane options
			if ($btn_cat != "modelSwitch") {
				for ($i = 0; $i < $masterOModels.length; $i++) {
					if ($selectModel == $masterOModels[$i].name) {
						$txt = $masterOModels[$i].descp[$btn_cat];
						$oModels = new modalCard(
							$masterOModels[$i].commonTitle,
							$masterOModels[$i].tankCapacity,
							$masterOModels[$i].burnerType,
							$masterOModels[$i].frameType,
							$masterOModels[$i].image,
							$txt,
							$masterOModels[$i].alt,
							$masterOModels[$i].learnLink,
							$masterOModels[$i].inquiryLink,
						);
						$oModels.update();
					}
				}
			} else {
				for ($i = 0; $i < $masterOModels.length; $i++) {
					if ($selectModel == $masterOModels[$i].name) {
						$oModels = new modalSwitch(
							$masterOModels[$i].burnerType,
							$masterOModels[$i].image,
							$masterOModels[$i].alt,
							$masterOModels[$i].learnLink,
							$masterOModels[$i].inquiryLink,
						);
						$oModels.update();
					}
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
						$masterOModels[$i].inquiryLink,
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
