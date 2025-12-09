jQuery(document).ready(function ($) {
	$url = $(location).attr("href"); // gets the full url of the current page example https://marathonequipmentinc.com/mastic-mixers/
	//$urlIdentify = $url.split('/')[3]; // splits the url to get the page title. using the previous example
	// https://marathonequipmentinc.com/mastic-mixers/ would split -> ['https:','marathonequipmentinc','com','mastic-mixers']
	// [3] gets 'mastic-mixers' this will be used for the switch case function to find what database id the code will build
	// you can find it in the 1110 line ish area  it will look like this:
	// switch ($urlIdentify) {
	//     case 'mastic-mixers':
	//         $newData = $specsData.findIndex(function ($ac) {
	//             return $ac.machineAcronym == 'MM';
	//         });
	//         break;
	// local host -> $urlIdentify = $url.split('/')[4].split('.html')[0];
	// remote host -> $urlIdentify = $url.split('/')[3];
	$urlIdentify = $url.split('/')[3]; //<- reads the url to access the page category
	let $specsData = null;
	switch ($urlIdentify) {
		
		case "hot-mix-transporters": // <- reads for remote url link
		case "crack-sealing-and-waterproofing":
		case "asphalt-sealcoat-sprayers":
		case "tack-emulsion-sprayers":
		case "mastic-mixers":
		case "product-card-ui":
		case "index.html": // <- this to be used for the demo
			//"https://marathonequipmentinc.com/wp-content/themes/oceanwp-child/js/equipmentSpecsData.json" ->remote
			
			$.getJSON(
				"json/equipmentSpecsData.json",
				function (data) {
					$specsData = data;					
					specsData();
					tableBuld($newSpecsData); // this builds the specs table for the desktop modal
					mobileTableBuild($newSpecsData);
					tableSelection();
				}
			);

			break;
		default:
			break;
	}

	//specsData();
	// specsData holds all the specifications of each machine models
	// it is also responsible for finding the requested model specs based on the page url title ie -> mastic-mixers
	function specsData() {
		

		// this searches the database ($specsData) for a specific index acronym
		// if the page url is https://marathonequipmentinc.com/mastic-mixers/
		// the $urlIdentify is mastic-mixers which means the $newData is 'MM'

		switch ($urlIdentify) {
			
			case "index.html": //<- used for the demo			
			case "crack-sealing-and-waterproofing": // <- used for the live website
				$newData = $specsData.findIndex(function ($ac) {
					return $ac.machineAcronym == "CSAW";
				});
				break;
			
		}

		// $newSpecsData gets the requested data by the acronym and returns the requested data.
		$newSpecsData = $specsData[$newData];
		return $newSpecsData;
	}

	function tableBuld($newSpecsData) {
		$data = $newSpecsData;
		$tableContainer = $("div#tableModalContent");

		//empty inner html
		$($tableContainer).html("");

		$tableBuild = "";

		$numOfMachines = Object.keys($data.data);
		// this gets the machine acronyms of the requested data it is formatted into an Array
		// $numOfMachines -> ['MM','MD']

		for ($i = 0; $i < $numOfMachines.length; $i++) {
			$objKeys = Object.keys($data.data[$numOfMachines[$i]]);
			// objKeys gets the keys associated to each Model
			// example for Mastic mixers the objKeys would be
			// ['models','shipW','eng','burners','dimGroup','capGroup','suspenGroup'] for MM
			// ['models','shipW','cap','burner','dimGroup'] for MD
			if ($i == 0) {
				$tableBuild += '<table class="table align-middle table-hover" id="' + $numOfMachines[$i] + '-desktop-table">';
				$tableBuild +=
					'<caption id="' + $numOfMachines[$i] + '-caption">Specifications For The Direct Fired Models </caption>';
				$tableBuild += "<tbody>";
			} else {
				$tableBuild += '<table class="table  table-hover d-none" id="' + $numOfMachines[$i] + '-desktop-table">';
				$tableBuild += '<caption id="' + $numOfMachines[$i] + '-caption">Specifications For The Models </caption>';
				$tableBuild += "<tbody>";
			}
			for ($j = 0; $j < $objKeys.length; $j++) {
				switch ($objKeys[$j]) {
					case "dimGroup":
					case "capGroup":
					case "suspenGroup":
					case "shPlGroup":
					case "shipWGroup":
						$colspan = $data.data[$numOfMachines[$i]]["models"]["val"].length + 1;

						if ($objKeys[$j] == "dimGroup") {
							$tableCategory = "Dimensions";
						} else if ($objKeys[$j] == "capGroup") {
							$tableCategory = "Capacity";
						} else if ($objKeys[$j] == "suspenGroup") {
							$tableCategory = "Suspension";
						} else if ($objKeys[$j] == "shPlGroup") {
							$tableCategory = "Shoveling Platform";
						} else if ($objKeys[$j] == "shipWGroup") {
							$tableCategory = "Shipping Weight";
						}
						$tableBuild += "<tr>";
						$tableBuild +=
							'<td class="tbSpecTitle fw-bold border-bottom-3 table-colspan-border pt-4 " data-bs-toggle="tooltip" data-bs-placement="top" data-title="' +
							$tableCategory +
							'" colspan="' +
							$colspan +
							'"> ' +
							$tableCategory +
							"</td>";
						$tableBuild += "</tr>";
						$subKeys = Object.keys($data.data[$numOfMachines[$i]][$objKeys[$j]]);
						// the $subKeys are keys that are within dimGroup,capGroup,suspenGroup,shPlGroup,shipWGroup objects
						// for example MM.dimGroup keys are ['ol','ow','oh','lh','dch']
						// lets read this -> $data.data[$numOfMachines[$i]][$objKeys[$j]][$subKeys[$m]]
						// partial conversion -> $data.data[$numOfMachines[0]][$objKeys[0]][$subKeys[0]]
						// full conversion -> $data.data['MM']['dimGroup']['ol']
						// example $data.data['MM']['dimGroup']['ol']['val] is ['208\"', '236\"']
						// example $data.data['MM']['dimGroup']['ol']['val][0] is the first string in the val array ' 208\" '
						for ($m = 0; $m < $subKeys.length; $m++) {
							$tableBuild += "<tr>";
							$cat = $data.data[$numOfMachines[$i]][$objKeys[$j]][$subKeys[$m]]["title"];
							$tableBuild += '<td class="">' + $cat + "</td > ";
							for ($k = 0; $k < $dataLength; $k++) {
								$model = $data.data[$numOfMachines[$i]]["models"]["val"][$k];
								$modelValue = $data.data[$numOfMachines[$i]][$objKeys[$j]][$subKeys[$m]]["val"][$k];
								$tableBuild +=
									'<td id="' +
									$model +
									"-" +
									$cat.replace(/[ \.\[\]\(\)]/g, "").trim() +
									'" class="" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="' +
									$cat +
									'">' +
									$data.data[$numOfMachines[$i]][$objKeys[$j]][$subKeys[$m]]["val"][$k] +
									"</td>";
							}
							$tableBuild += "</tr>";
						}
						break;
					default:
						// lets read this -> $data.data[$numOfMachines[$i]][$objKeys[$j]]
						// $data.data['MM']['shipW']
						// $data.data['MM']['shipW']['val'] -> ['6,300 lbs (2,858 kg)', '7,007 lbs (3,178 kg)']
						// $data.data['MM']['shipW']['val'][0] -> '6,300 lbs (2,858 kg)'
						$dataLength = $data.data[$numOfMachines[$i]][$objKeys[$j]]["val"].length;
						$tableBuild += "<tr>";
						$cat = $data.data[$numOfMachines[$i]][$objKeys[$j]]["title"];
						$tableBuild += '<td class="">' + $cat + " </td>";
						for ($k = 0; $k < $dataLength; $k++) {
							$model = $data.data[$numOfMachines[$i]]["models"]["val"][$k];
							$tableBuild +=
								'<td id="' +
								$model +
								"-" +
								$cat.replace(/[ \.\[\]\(\)]/g, "").trim() +
								'" class="" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-custom-class="tooltip-custom" title="' +
								$cat +
								'">' +
								$data.data[$numOfMachines[$i]][$objKeys[$j]]["val"][$k] +
								" </td>";
						}
						$tableBuild += "</tr>";
						break;
				}
			}
		}
		$tableBuild += "</tbody>";
		$tableBuild += "</table>";
		$($tableContainer).html($tableBuild);
	}

	// this toggles which specs table is shown in the desktop modal based on the specification button id.
	function tableSelection() {
		$("button.SpecBox").on("click", function () {
			$id = $(this).attr("id");

			switch ($id) {
				
				case "ucmkSpecs":
					$capId = "UCMKPT-caption";
					$caption = "Specifications For The Propane Fired Gravity Pour Melting Kettle";
					$selectTable = "UCMKPT-desktop-table";
					$btnGroup = "UCMKbtnGroupTankCapacity";
					$specsTitles = [
						"Models",
						"ShippingWeight",
						"Engine",
						"Burner",
						"OverallLength",
						"OverallWidth",
						"OverallHeight",
						"LoadingHeight",
						"MaterialVat",
						"HeatTransferOil",
						"Axle",
						"Capacity",
						"Tires-Size",
					];
					break;
				case "ucmkdtSpecs":
					$capId = "UCMKDT-caption";
					$caption = "Specifications For The Diesel Fired Gravity Pour Melting Kettle";
					$selectTable = "UCMKDT-desktop-table";
					$btnGroup = "UCMKbtnGroupTankCapacity";
					$specsTitles = [
						"Models",
						"ShippingWeight",
						"DieselEngine",
						"Engine",
						"Burner",
						"OverallLength",
						"OverallWidth",
						"OverallHeight",
						"LoadingHeight",
						"MaterialVat",
						"HeatTransferOil",
						"Axles",
						"LoadCapacity",
						"Tires-Size",
					];
					break;
				case "keraSpecs":
					$capId = "KERABRE-caption";
					$caption = "Specifications For The Electrically Heated Hose and Wand Melting Kettle";
					$selectTable = "KERABRE-desktop-table";
					$btnGroup = "KERAbtnGroupTankCapacity";
					$specsTitles = [
						"Models",
						"ShippingWeight",
						"Engine",
						"Burners",
						"OverallLength",
						"OverallWidth",
						"OverallHeight",
						"LoadingHeight",
						"MaterialVat",
						"HeatTransferOil",
						"DieselFuelTank",
						"HydraulicOilTank",
						"Axles",
						"LoadCapacity",
						"Tires-Size",
					];
					break;
				
			}

			//

			$findActBtn = $("#" + $btnGroup)
				.children(".act")
				.attr("id");
			//
			if ($findActBtn == undefined) {
				switch ($id) {
					case "halSpecs":
						$findActBtn = "HALBtn";
						break;
					case "HEPR36Specs":
						$findActBtn = "HEPR36Btn";
						break;
					case "HMT8000Specs":
						$findActBtn = "HMT8000ODLBtn";
						break;
					case "HMT4000Specs":
						$findActBtn = "HMT4000ODLBtn";
						break;
					case "dps9Specs":
						$findActBtn = "DPS9Btn";
						break;
					case "dps550tSpecs":
						$findActBtn = "DPS550TBtn";
						break;
					case "kera10Specs":
						$findActBtn = "KERA10Btn";
						break;
					case "rcrSpecs":
						$findActBtn = "RCR300KBtn";
						break;
				}
			}

			$actBtn = $findActBtn.split("Btn")[0];

			$("#" + $selectTable + " " + "td").each(function () {
				$(this).removeClass("table-data-color table-header-color ");
				for ($n = 0; $n < $specsTitles.length; $n++) {
					//
					$("#" + $actBtn.replace(/\s/g, "") + "-" + $specsTitles[$n]).addClass("table-data-color");
				}
			});

			$tables = $("div#tableModalContent").children();
			$($tables).addClass("d-none");
			$("#" + $selectTable).removeClass("d-none");

			/// change caption of the table
			$("#" + $capId).text($caption);
		});
	}

	// this builds the specs table for the mobile version
	function mobileTableBuild($newSpecsData) {
		$data = $newSpecsData;
		//
		$result = [];
		$masterResults = [];

		$machineAcronyms = Object.keys($data.data);
		//

		for ($i = 0; $i < $machineAcronyms.length; $i++) {
			switch ($machineAcronyms[$i]) {
				
				case "UCMKPT":
					$ucmkptArray = [];
					$ucmkPTData = $data.data.UCMKPT;
					$models = $ucmkPTData.models.val;
					$shipWeights = $ucmkPTData.shipW.val;
					$engs = $ucmkPTData.eng.val;
					$burners = $ucmkPTData.bu.val;
					$overallLengths = $ucmkPTData.dimGroup.ol.val;
					$overallWidths = $ucmkPTData.dimGroup.ow.val;
					$overallHeights = $ucmkPTData.dimGroup.oh.val;
					$overallLoadHeights = $ucmkPTData.dimGroup.lh.val;
					$materialVats = $ucmkPTData.capGroup.maVat.val;
					$heatTransOil = $ucmkPTData.capGroup.heTO.val;
					$axles = $ucmkPTData.suspenGroup.ax.val;
					$cap = $ucmkPTData.suspenGroup.capa.val;
					$tires = $ucmkPTData.suspenGroup.tires.val;

					for ($j = 0; $j < $shipWeights.length; $j++) {
						$entry = [
							["Model", $models[$j]],
							["Shipping Weight", $shipWeights[$j]],
							["Engine", $engs[$j]],
							["Burner", $burners[$j]],
							["Dimensions", 0],
							["Overall Length", $overallLengths[$j]],
							["Overall Width", $overallWidths[$j]],
							["Overall Height", $overallHeights[$j]],
							["Overall Loading Height", $overallLoadHeights[$j]],
							["Capacity", 0],
							["Material Vats", $materialVats[$j]],
							["Heat Transfer Oil", $heatTransOil[$j]],
							["Suspension", 0],
							["Axle(s)", $axles[$j]],
							["Load Capacity", $cap[$j]],
							["Tires - Size", $tires[$j]],
						];
						$ucmkptArray.push($entry);
					}
					$masterResults.push(["div#UCMKPT_Specscontainer", $ucmkptArray]);
					break;
				case "UCMKDT":
					$ucmkdtArray = [];
					$ucmkDTData = $data.data.UCMKDT;
					$models = $ucmkDTData.models.val;
					$shipWeights = $ucmkDTData.shipW.val;
					$dieselEng = $ucmkDTData.de.val;
					$burner = $ucmkDTData.bu.val;
					$overallLengths = $ucmkDTData.dimGroup.ol.val;
					$overallWidths = $ucmkDTData.dimGroup.ow.val;
					$overallHeights = $ucmkDTData.dimGroup.oh.val;
					$overallLoadHeights = $ucmkDTData.dimGroup.lh.val;
					$materialVats = $ucmkDTData.capGroup.maVat.val;
					$heatTransOil = $ucmkDTData.capGroup.heTo.val;
					$axles = $ucmkDTData.suspenGroup.ax.val;
					$capacity = $ucmkDTData.suspenGroup.capacity.val;
					$tires = $ucmkDTData.suspenGroup.tires.val;

					for ($j = 0; $j < $shipWeights.length; $j++) {
						$entry = [
							["Model", $models[$j]],
							["Shipping Weight", $shipWeights[$j]],
							["Diesel Engine", $dieselEng[$j]],
							["Burner", $burner[$j]],
							["Dimensions", 0],
							["Overall Length", $overallLengths[$j]],
							["Overall Width", $overallWidths[$j]],
							["Overall Height", $overallHeights[$j]],
							["Overall Loading Height", $overallLoadHeights[$j]],
							["Capacity", 0],
							["Material Vat", $materialVats[$j]],
							["Heat Transfer Oil", $heatTransOil[$j]],
							["Suspension", 0],
							["Axle(s)", $axles[$j]],
							["Load Capacity", $cap[$j]],
							["Tires - Size", $tires[$j]],
						];
						$ucmkdtArray.push($entry);
					}
					$masterResults.push(["div#UCMKDT_Specscontainer", $ucmkdtArray]);
					break;
				case "KERABRE":
					$kerabreArray = [];
					$kerabreData = $data.data.KERABRE;
					$models = $kerabreData.models.val;
					$shipWeights = $kerabreData.shipW.val;
					$eng = $kerabreData.eng.val;
					$burners = $kerabreData.burn.val;
					$overallLengths = $kerabreData.dimGroup.ol.val;
					$overallWidths = $kerabreData.dimGroup.ow.val;
					$overallHeights = $kerabreData.dimGroup.oh.val;
					$loadingHeights = $kerabreData.dimGroup.lh.val;
					$matVat = $kerabreData.capGroup.matVat.val;
					$heatTransOil = $kerabreData.capGroup.hto.val;
					$dieselFuelTank = $kerabreData.capGroup.dft.val;
					$hydrOilTank = $kerabreData.capGroup.hot.val;
					$axles = $kerabreData.suspenGroup.ax.val;
					$capacity = $kerabreData.suspenGroup.capa.val;
					$tires = $kerabreData.suspenGroup.tires.val;
					for ($j = 0; $j < $shipWeights.length; $j++) {
						$entry = [
							["Model", $models[$j]],
							["Shipping Weight", $shipWeights[$j]],
							["Engine", $eng[$j]],
							["Burner", $burners[$j]],
							["Dimensions", 0],
							["Overall Length", $overallLengths[$j]],
							["Overall Width", $overallWidths[$j]],
							["Overall Height", $overallHeights[$j]],
							["Overall Loading Height", $loadingHeights[$j]],
							["Capacity", 0],
							["Material Vat", $matVat[$j]],
							["Heat Transfer Oil", $heatTransOil[$j]],
							["Diesel Fuel Tank", $dieselFuelTank[$j]],
							["Hydraulic Oil Tank", $hydrOilTank[$j]],
							["Suspension", 0],
							["Axle", $axles[$j]],
							["Load Capacity", $capacity[$j]],
							["Tires", $tires[$j]],
						];
						$kerabreArray.push($entry);
					}
					$masterResults.push(["div#KERA_Specscontainer", $kerabreArray]);
					break;
				
			}
		}

		for ($i = 0; $i < $masterResults.length; $i++) {
			$mobileTableContainer = $masterResults[$i][0];

			$dataMasterArrayLength = $masterResults[$i][1].length; // the number of arrays in the sub-main array [Array(6), Array(6), Array(6)]
			$($mobileTableContainer).html("");
			$mobileTableBuild = "";
			for ($j = 0; $j < $dataMasterArrayLength; $j++) {
				$mobileModels = $masterResults[$i][1][$j][0][1];

				// $mobileModels will ensure that the default active model specs sheet is shown first
				switch ($mobileModels) {
					case "DF10W":
					case "CR300K":
					case "RCR300K":
					case "UCMK130PT":
					case "UCMK230DT":
					case "KERA180BRE":
					case "KERA10":
					case "HAL":
					case "HMT8000ODL":
					case "HMT4000ODL":
					case "HEPR36":
					case "PAS70G":
					case "DPS9":
					case "DPS550T":
					case "PPES10":
					case "TPS115PS":
					case "LD600PT":
					case "LD600DT":
					case "KEB260PT":
					case "MM250DT":
					case "MM250ADT":
					case "MD12":
						$mobileTableBuild += '<table class="table less table-sm t-active" id="' + $mobileModels + 'Table">';
						break;
					default:
						$mobileTableBuild += '<table class="table less table-sm d-none" id="' + $mobileModels + 'Table">';
						break;
				}
				$dataArrLength = $masterResults[$i][1][$j].length;
				$mobileTableBuild += "<tbody>";
				$mobileTableBuild += "<tr>";

				for ($k = 0; $k < $dataArrLength; $k++) {
					$mobileCat = $masterResults[$i][1][$j][$k][0];
					$mobileVal = $masterResults[$i][1][$j][$k][1];

					if ($mobileVal === 0) {
						switch ($mobileCat) {
							case "Dimensions":
							case "Capacity":
							case "Suspension":
							case "Shoveling Platform":	
								$mobileTableBuild +=
									'<td class="tbSpecTitle py-3 fw-bold border-bottom-3 table-colspan-border text-center" colspan= "2" >' +
									$mobileCat +
									"</td>";
								break;
							default:
								$mobileTableBuild += '<td class="py-3 text-center" >' + $mobileCat + "</td>";
								$mobileTableBuild += '<td class="py-3 text-center table-data-color" >' + $mobileVal + "</td>";
								break;
						}
					} else {
						$mobileTableBuild += '<td class="py-3 text-center" >' + $mobileCat + "</td>";
						$mobileTableBuild += '<td class="py-3 text-center table-data-color" >' + $mobileVal + "</td>";
					}

					$mobileTableBuild += "</tr>";
				}
				$mobileTableBuild += "</tbody>";
				$mobileTableBuild += "</table>";
				$($mobileTableContainer).html($mobileTableBuild);
				//
			}
		}
	}
});

