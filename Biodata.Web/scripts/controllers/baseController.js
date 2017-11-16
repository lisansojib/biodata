angular.module('biodataChart')
  .controller('baseController', function ($scope, $document, $rootScope, $timeout, $state, $modal) {

      //set minimum date first time
      // $scope.isSecondary = false;
      if (localStorage.getItem("birthdate") != "undefined" && localStorage.getItem("birthdate") != undefined) {
          $scope.birthdate = localStorage.getItem("birthdate");
          $scope.birthmonth = localStorage.getItem("birthmonth");
          $scope.birthyear = localStorage.getItem("birthyear");


      } else {
          var minDate = new Date("01-01-1970");
          $scope.birthdate = minDate.getDate();
          $scope.birthmonth = minDate.getMonth() + 1;
          $scope.birthyear = minDate.getFullYear();
          setLocalStorage($scope.birthdate, $scope.birthmonth, $scope.birthyear, true);
      }




      if (localStorage.getItem("biorhythmdate") != "undefined" && localStorage.getItem("biorhythmdate") != undefined) {
          $scope.biorhythmdate = localStorage.getItem("biorhythmdate");
          $scope.biorhythmmonth = localStorage.getItem("biorhythmmonth");
          $scope.biorhythmyear = localStorage.getItem("biorhythmyear");
      } else {
          //set current date 
          var currentDate = new Date();
          $scope.biorhythmdate = currentDate.getDate();
          $scope.biorhythmmonth = currentDate.getMonth() + 1;
          $scope.biorhythmyear = currentDate.getFullYear();
          setLocalStorage($scope.biorhythmdate, $scope.biorhythmmonth, $scope.biorhythmyear, false);
      }




      $scope.CalulateBiorhythmYearly = CalculateYearly;
      $scope.CalulateBiorhythmBarGraph = CalulateBiorhythmBarGraph;
      $scope.CalulateBiorhythmWave = CalulateBiorhythmWave;
      $scope.CalulateBiorhythmYearly();
      $scope.CalulateBiorhythmWave();
      $scope.CalulateBiorhythmBarGraph();

      $scope.Calulate = function () {
          $scope.DateDisplay = $scope.biorhythmdate + "." + $scope.biorhythmmonth + "." + $scope.biorhythmyear;

          if ($scope.birthdate <= 0 || $scope.biorhythmdate <= 0 || $scope.birthdate > 31 || $scope.biorhythmdate > 31) {
              $scope.dateError = "Invalid date";
          }
          else if ($scope.birthmonth > 12 || $scope.biorhythmmonth > 12 || $scope.birthmonth <= 0 || $scope.biorhythmmonth <= 0) {
              $scope.dateError = "Invalid date";
          }
          else if ($scope.birthyear <= 0 || $scope.biorhythmyear <= 0 || ($scope.biorhythmyear && $scope.biorhythmyear.length < 4) || ($scope.birthyear && $scope.birthyear.length < 4)) {
              $scope.dateError = "Invalid date";
          }
          else {
              $scope.dateError = '';
              //  if ($state.current.name == "wave" || $state.current.name == "home") {

              setLocalStorage($scope.biorhythmdate, $scope.biorhythmmonth, $scope.biorhythmyear, false);
              setLocalStorage($scope.birthdate, $scope.birthmonth, $scope.birthyear, true);
              // $state.go('wave')
              $scope.CalulateBiorhythmYearly();
              $scope.CalulateBiorhythmWave();

              $scope.CalulateBiorhythmBarGraph();

              //}
              //if ($state.current.name == "bar") {
              //    setLocalStorage($scope.biorhythmdate, $scope.biorhythmmonth, $scope.biorhythmyear, false);
              //    setLocalStorage($scope.birthdate, $scope.birthmonth, $scope.birthyear, true);

              //}
              //if ($state.current.name == "yearly") {
              //    setLocalStorage($scope.biorhythmdate, $scope.biorhythmmonth, $scope.biorhythmyear, false);
              //    setLocalStorage($scope.birthdate, $scope.birthmonth, $scope.birthyear, true);

              //}
          }
      }



      function CalculateYearly() {

          $scope.BiorhythmDate = new Date($scope.biorhythmmonth + "-" + $scope.biorhythmdate + "-" + $scope.biorhythmyear);
          var minimumDate = new Date($scope.birthmonth + "-" + $scope.birthdate + "-" + $scope.birthyear);
          var firstDate = new Date(01 + "-" + 01 + "-" + $scope.biorhythmyear);
          var lastDate = new Date(12 + "-" + 31 + "-" + $scope.biorhythmyear);
          // var age = dateDiffInDays(minimumDate, $scope.BiorhythmDate);

          $scope.DateDisplay = $scope.biorhythmdate + "." + $scope.biorhythmmonth + "." + $scope.biorhythmyear;

          var yearlyDataArray = [];
          var dateArray = getDates(firstDate, lastDate);

          for (var i = 0; i < dateArray.length; i++) {
              var dateObj = new Date(dateArray[i]);
              var day = lastDate.getDate().toString();
              var month = (lastDate.getMonth() + 1).toString();
              var year = lastDate.getFullYear().toString();
              var age = dateDiffInDays(minimumDate, dateObj);

              var data = GetDataforDate(false, this, age, [-7, 67], ['Math.sin(2*Math.PI*(s/23))', 'Math.sin(2*Math.PI*(s/28))', 'Math.sin(2*Math.PI*(s/33))', '(Math.sin(2*Math.PI*(s/23))+Math.sin(2*Math.PI*(s/28))+Math.sin(2*Math.PI*(s/33)))/3'], [day, month, year], 0);

              var ttl = dateObj.getDate().toString() + "." + (dateObj.getMonth() + 1).toString() + "." + dateObj.getFullYear().toString() + " - Physical : " + data.Physical + "%, Emotional : " + data.Emotional + "%, Intellectual : " + data.Intellectual + "%";
              $scope.current = $scope.BiorhythmDate.toDateString();
              yearlyDataArray.push({ date: dateObj.toDateString(), BiorhythmDetails: data, title: ttl })
          }

          var rowdata = [];

          //yearlyDataArray.sort(sorting("date"))

          for (var row = 1; row <= 31; row++) {
              var objdatewisedata = [];
              for (var col = 1; col <= 12; col++) {
                  var d = yearlyDataArray.filter(function (el) {
                      return new Date(el.date).getDate() == row && (new Date(el.date).getMonth() + 1) == col;
                  })
                  objdatewisedata.push(d);
              }
              rowdata.push(objdatewisedata);
          }
          $scope.CurrentYearData = rowdata;

      }

      function CalulateBiorhythmBarGraph() {
          // Calculation done for next 7 days from currentdate
          $scope.BiorhythmDate = new Date($scope.biorhythmmonth + "-" + $scope.biorhythmdate + "-" + $scope.biorhythmyear);
          var minimumDate = new Date($scope.birthmonth + "-" + $scope.birthdate + "-" + $scope.birthyear);
          var lastDate = $scope.BiorhythmDate.addDays(6);
          var dateArrayforBarGraph = getDates($scope.BiorhythmDate, lastDate);
          $scope.DateDisplay = $scope.biorhythmdate + "." + $scope.biorhythmmonth + "." + $scope.biorhythmyear;
          var barGraphDataArray = [];
          for (var i = 0; i < dateArrayforBarGraph.length; i++) {

              var dateObj = new Date(dateArrayforBarGraph[i]);

              var day = lastDate.getDate().toString();
              var month = (lastDate.getMonth() + 1).toString();
              var year = lastDate.getFullYear().toString();
              var age = dateDiffInDays(minimumDate, dateObj);

              var data = GetDataforDate(false, this, age, [-7, 67], ['Math.sin(2*Math.PI*(s/23))', 'Math.sin(2*Math.PI*(s/28))', 'Math.sin(2*Math.PI*(s/33))', '(Math.sin(2*Math.PI*(s/23))+Math.sin(2*Math.PI*(s/28))+Math.sin(2*Math.PI*(s/33)))/3'], [day, month, year], 0);

              var ttl = dateObj.getDate().toString() + "." + (dateObj.getMonth() + 1).toString() + "." + dateObj.getFullYear().toString() + " - Physical : " + data.Physical + "%, Emotional : " + data.Emotional + "%, Intellectual : " + data.Intellectual + "%";
              var dayname = GetDays()[dateObj.getDay()];
              var monthname = GetMonths()[dateObj.getMonth()];

              //width calculation 
              //100% - > 150
              var dateObjForNExtDay;
              var age2;
              if (i == dateArrayforBarGraph.length) {
                  dateObjForNExtDay = new Date(lastDate.addDays(1));
              } else {
                  dateObjForNExtDay = new Date(dateArrayforBarGraph[i + 1]);

              }
              var physicalLeftToRight = true;
              age2 = dateDiffInDays(minimumDate, dateObjForNExtDay);
              debugger; 
              //for physical
              if (data.Physical > 0) {
                  //for arrow

                  var dataArrow = GetDataforDate(false, this, age2, [-7, 67], ['Math.sin(2*Math.PI*(s/23))', 'Math.sin(2*Math.PI*(s/28))', 'Math.sin(2*Math.PI*(s/33))', '(Math.sin(2*Math.PI*(s/23))+Math.sin(2*Math.PI*(s/28))+Math.sin(2*Math.PI*(s/33)))/3'], [day, month, year], 0);
                  if (parseInt(data.Physical) > parseInt(dataArrow.Physical)) {
                      physicalLeftToRight = false;
                  }
                  data.IsPhysicalGreen = true;
                  data.PhysicalLeftToRight = physicalLeftToRight;
                  var px = (parseFloat(data.Physical) * 150) / 100;
                  data.PhysicalWidth = "width:" + px + "px";                 
                  data.PhysicalStyle = "left:150px";
                  data.PhysicalClass = "wbark";
                
              }
              if (data.Physical == 0) {
                  var dataArrow = GetDataforDate(false, this, age2, [-7, 67], ['Math.sin(2*Math.PI*(s/23))', 'Math.sin(2*Math.PI*(s/28))', 'Math.sin(2*Math.PI*(s/33))', '(Math.sin(2*Math.PI*(s/23))+Math.sin(2*Math.PI*(s/28))+Math.sin(2*Math.PI*(s/33)))/3'], [day, month, year], 0);
                  if (parseInt(data.Physical) > parseInt(dataArrow.Physical)) {
                      physicalLeftToRight = false;
                  }
                  data.IsPhysicalGreen = true;
                  data.PhysicalLeftToRight = physicalLeftToRight;
                  data.PhysicalWidth = "width:0px";
                  data.PhysicalStyle = "left:150px";
                  data.PhysicalClass = "wbark";
              }
              if (data.Physical < 0) {

                  var dataArrow = GetDataforDate(false, this, age2, [-7, 67], ['Math.sin(2*Math.PI*(s/23))', 'Math.sin(2*Math.PI*(s/28))', 'Math.sin(2*Math.PI*(s/33))', '(Math.sin(2*Math.PI*(s/23))+Math.sin(2*Math.PI*(s/28))+Math.sin(2*Math.PI*(s/33)))/3'], [day, month, year], 0);
                  if (parseInt(data.Physical) > parseInt(dataArrow.Physical)) {
                      physicalLeftToRight = false;
                  }
                  data.PhysicalLeftToRight = physicalLeftToRight;
                  data.IsPhysicalGreen = false;
                  var px = ((parseFloat(data.Physical) * 150) / 100) * -1;
                  data.PhysicalWidth = "width:" + px + "px";
                  data.PhysicalStyle = "left:" + (150 - px) + "px";
                  data.PhysicalClass = "wbarz";
              }

              var emotionalLeftToRight = true;
              //for Emotional
              if (data.Emotional > 0) {

                  var dataArrow = GetDataforDate(false, this, age2, [-7, 67], ['Math.sin(2*Math.PI*(s/23))', 'Math.sin(2*Math.PI*(s/28))', 'Math.sin(2*Math.PI*(s/33))', '(Math.sin(2*Math.PI*(s/23))+Math.sin(2*Math.PI*(s/28))+Math.sin(2*Math.PI*(s/33)))/3'], [day, month, year], 0);
                  if (parseInt(data.Emotional) > parseInt(dataArrow.Emotional)) {
                      emotionalLeftToRight = false;
                  }
                  data.EmotionalLeftToRight = emotionalLeftToRight;
                  data.IsEmotionalGreen = true;
                  var px = (parseFloat(data.Emotional) * 150) / 100;
                  data.EmotionalWidth = "width:" + px + "px";
                  data.EmotionalStyle = "left:150px";
                  data.EmotionalClass = "wbark";
              }
              if (data.Emotional == 0) {
                  var dataArrow = GetDataforDate(false, this, age2, [-7, 67], ['Math.sin(2*Math.PI*(s/23))', 'Math.sin(2*Math.PI*(s/28))', 'Math.sin(2*Math.PI*(s/33))', '(Math.sin(2*Math.PI*(s/23))+Math.sin(2*Math.PI*(s/28))+Math.sin(2*Math.PI*(s/33)))/3'], [day, month, year], 0);
                  if (parseInt(data.Emotional) > parseInt(dataArrow.Emotional)) {
                      emotionalLeftToRight = false;
                  }
                  data.EmotionalLeftToRight = emotionalLeftToRight;
                  data.IsEmotionalGreen = true;

                  data.EmotionalWidth = "width:0px";
                  data.EmotionalStyle = "left:150px";
                  data.EmotionalClass = "wbark";
              }
              if (data.Emotional < 0) {
                  var dataArrow = GetDataforDate(false, this, age2, [-7, 67], ['Math.sin(2*Math.PI*(s/23))', 'Math.sin(2*Math.PI*(s/28))', 'Math.sin(2*Math.PI*(s/33))', '(Math.sin(2*Math.PI*(s/23))+Math.sin(2*Math.PI*(s/28))+Math.sin(2*Math.PI*(s/33)))/3'], [day, month, year], 0);
                  if (parseInt(data.Emotional) > parseInt(dataArrow.Emotional)) {
                      emotionalLeftToRight = false;
                  }
                  data.EmotionalLeftToRight = emotionalLeftToRight;
                  data.IsEmotionalGreen = false;
                  var px = ((parseFloat(data.Emotional) * 150) / 100) * -1;
                  data.EmotionalWidth = px + "px";
                  data.EmotionalStyle = "left:" + (150 - px) + "px";
                  data.EmotionalClass = "wbarz";
              }

              var intellectualLeftToRight = true;
              //for Intellectual
              if (data.Intellectual > 0) {
                  var dataArrow = GetDataforDate(false, this, age2, [-7, 67], ['Math.sin(2*Math.PI*(s/23))', 'Math.sin(2*Math.PI*(s/28))', 'Math.sin(2*Math.PI*(s/33))', '(Math.sin(2*Math.PI*(s/23))+Math.sin(2*Math.PI*(s/28))+Math.sin(2*Math.PI*(s/33)))/3'], [day, month, year], 0);
                  if (parseInt(data.Intellectual) > parseInt(dataArrow.Intellectual)) {
                      emotionalLeftToRight = false;
                  }
                  data.IntellectualLeftToRight = intellectualLeftToRight;
                  data.IsIntellectualGreen = true;
                  var px = (parseFloat(data.Intellectual) * 150) / 100;
                  data.IntellectualWidth = "width:" + px + "px";
                  data.IntellectualStyle = "left:150px";
                  data.IntellectualClass = "wbark";
              }
              if (data.Intellectual == 0) {
                  var dataArrow = GetDataforDate(false, this, age2, [-7, 67], ['Math.sin(2*Math.PI*(s/23))', 'Math.sin(2*Math.PI*(s/28))', 'Math.sin(2*Math.PI*(s/33))', '(Math.sin(2*Math.PI*(s/23))+Math.sin(2*Math.PI*(s/28))+Math.sin(2*Math.PI*(s/33)))/3'], [day, month, year], 0);
                  if (parseInt(data.Intellectual) > parseInt(dataArrow.Intellectual)) {
                      emotionalLeftToRight = false;
                  }
                  data.IntellectualLeftToRight = intellectualLeftToRight;
                  data.IsIntellectualGreen = true;
                  data.IntellectualWidth = "width:0px";
                  data.IntellectualStyle = "left:150px";
                  data.IntellectualClass = "wbark";
              }
              if (data.Intellectual < 0) {
                  var dataArrow = GetDataforDate(false, this, age2, [-7, 67], ['Math.sin(2*Math.PI*(s/23))', 'Math.sin(2*Math.PI*(s/28))', 'Math.sin(2*Math.PI*(s/33))', '(Math.sin(2*Math.PI*(s/23))+Math.sin(2*Math.PI*(s/28))+Math.sin(2*Math.PI*(s/33)))/3'], [day, month, year], 0);
                  if (parseInt(data.Intellectual) > parseInt(dataArrow.Intellectual)) {
                      emotionalLeftToRight = false;
                  }
                  data.IntellectualLeftToRight = intellectualLeftToRight;
                  data.IsIntellectualGreen = false;
                  var px = ((parseFloat(data.Intellectual) * 150) / 100) * -1;
                  data.IntellectualWidth = "width:" + px + "px";
                  data.IntellectualStyle = "left:" + (150 - px) + "px";
                  data.IntellectualClass = "wbarz";
              }


              barGraphDataArray.push({ dayname: dayname, datenum: dateObj.getDate(), monthname: monthname, date: dateObj.toDateString(), BiorhythmDetails: data, title: ttl })
          }

          $scope.BarGraphData = barGraphDataArray;
      }

      function CalulateBiorhythmWave() {
          $scope.DateDisplay = $scope.biorhythmdate + "." + $scope.biorhythmmonth + "." + $scope.biorhythmyear;
          var canvas = document.getElementById('biopri');
          // var context = canvas.getContext('2d');
          if (canvas != null) {
              canvas.addEventListener('mousemove', function (evt) {
                  var minimumDate = new Date($("#birthmonth").val() + "-" + $("#birthdate").val() + "-" + $("#birthyear").val());
                  var lastDate = new Date($("#biorhythmmonth").val() + "-" + $("#biorhythmdate").val() + "-" + $("#biorhythmyear").val());
                  var age = dateDiffInDays(minimumDate, lastDate);

                  biopos(evt, this, age, [-7, 67], ['Math.sin(2*Math.PI*(s/23))', 'Math.sin(2*Math.PI*(s/28))', 'Math.sin(2*Math.PI*(s/33))', '(Math.sin(2*Math.PI*(s/23))+Math.sin(2*Math.PI*(s/28))+Math.sin(2*Math.PI*(s/33)))/3'], [lastDate.getDate().toString(), (lastDate.getMonth() + 1).toString(), lastDate.getFullYear().toString()], 0);

              }, false);

              canvas.addEventListener('mouseout', function (evt) {
                  var minimumDate = new Date($("#birthmonth").val() + "-" + $("#birthdate").val() + "-" + $("#birthyear").val());
                  var lastDate = new Date($("#biorhythmmonth").val() + "-" + $("#biorhythmdate").val() + "-" + $("#biorhythmyear").val());
                  var age = dateDiffInDays(minimumDate, lastDate);

                  biopos(false, this, age, [-7, 67], ['Math.sin(2*Math.PI*(s/23))', 'Math.sin(2*Math.PI*(s/28))', 'Math.sin(2*Math.PI*(s/33))', '(Math.sin(2*Math.PI*(s/23))+Math.sin(2*Math.PI*(s/28))+Math.sin(2*Math.PI*(s/33)))/3'], [lastDate.getDate().toString(), (lastDate.getMonth() + 1).toString(), lastDate.getFullYear().toString()], 0);

              }, false);
          }
          // Calculation done for next 7 days from currentdate
          $scope.BiorhythmDate = new Date($scope.biorhythmmonth + "-" + $scope.biorhythmdate + "-" + $scope.biorhythmyear);
          var minimumDate = new Date($scope.birthmonth + "-" + $scope.birthdate + "-" + $scope.birthyear);
          var lastDate = $scope.BiorhythmDate.addDays(60);
          var fourDayAgo = $scope.BiorhythmDate.addDays(-4);
          var dateArrayforWaveGraph = getDates(fourDayAgo, lastDate);
          var waveGraphDataArray = [];

          for (var i = 0; i < dateArrayforWaveGraph.length; i++) {

              var dateObj = new Date(dateArrayforWaveGraph[i]);

              var day = $scope.BiorhythmDate.getDate().toString();
              var month = ($scope.BiorhythmDate.getMonth() + 1).toString();
              var year = $scope.BiorhythmDate.getFullYear().toString();
              var age = dateDiffInDays(minimumDate, dateObj);

              var data = GetDataforDate(false, this, age, [-7, 67], ['Math.sin(2*Math.PI*(s/23))', 'Math.sin(2*Math.PI*(s/28))', 'Math.sin(2*Math.PI*(s/33))', '(Math.sin(2*Math.PI*(s/23))+Math.sin(2*Math.PI*(s/28))+Math.sin(2*Math.PI*(s/33)))/3'], [day, month, year], 0);

              var ttl = dateObj.getDate().toString() + "." + (dateObj.getMonth() + 1).toString() + "." + dateObj.getFullYear().toString() + " - Physical : " + data.Physical + "%, Emotional : " + data.Emotional + "%, Intellectual : " + data.Intellectual + "%";

              var labl = dateObj.getDate().toString() + "." + (dateObj.getMonth() + 1).toString();
              waveGraphDataArray.push({ lable: labl, date: dateObj.toDateString(), BiorhythmDetails: data, title: ttl })
          }

          $scope.WaveGraphData = waveGraphDataArray;
          $scope.series = [];
          $scope.data = [];
          // $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }, { yAxisID: 'y-axis-3' }, { yAxisID: 'y-axis-4' }];


          $scope.series = ['Physical', 'Emotional', 'Intellectual', 'Average'];
          var physicalDataArr = [];
          var emotionalDataArr = [];
          var intellectualDataArr = [];
          var averageDataArr = [];
          $scope.labels = [];
          waveGraphDataArray.forEach(function (ele) {
              physicalDataArr.push(ele.BiorhythmDetails.Physical);
              emotionalDataArr.push(ele.BiorhythmDetails.Emotional);
              intellectualDataArr.push(ele.BiorhythmDetails.Intellectual);
              averageDataArr.push(ele.BiorhythmDetails.Average);
              $scope.labels.push(ele.lable)
          })


          $scope.data = [
               physicalDataArr,
                emotionalDataArr,
               intellectualDataArr,
                averageDataArr
          ];

          var selectPrimary = waveGraphDataArray.filter(function (ele) {
              return ele.date == $scope.BiorhythmDate.toDateString();
          });
          $scope.SelectedData = {};
          if (selectPrimary && selectPrimary.length > 0) {

              $scope.SelectedData.Physical = selectPrimary[0].BiorhythmDetails.Physical;
              $scope.SelectedData.Emotional = selectPrimary[0].BiorhythmDetails.Emotional;
              $scope.SelectedData.Intellectual = selectPrimary[0].BiorhythmDetails.Intellectual;
              $scope.SelectedData.Average = selectPrimary[0].BiorhythmDetails.Average;

          }

          // if ($scope.isSecondary) {
          //for secondary
          var canvasSecond = document.getElementById('biose');
          // var context = canvas.getContext('2d');
          if (canvasSecond != null) {
              canvasSecond.addEventListener('mousemove', function (evt) {
                  var minimumDate = new Date($("#birthmonth").val() + "-" + $("#birthdate").val() + "-" + $("#birthyear").val());
                  var lastDate = new Date($("#biorhythmmonth").val() + "-" + $("#biorhythmdate").val() + "-" + $("#biorhythmyear").val());
                  var age = dateDiffInDays(minimumDate, lastDate);

                  biopos(evt, this, age, [-7, 67],
                      ['Math.sin(2*Math.PI*(s/53))', 'Math.sin(2*Math.PI*(s/43))', 'Math.sin(2*Math.PI*(s/48))', 'Math.sin(2*Math.PI*(s/38))', '(Math.sin(2*Math.PI*(s/53))+Math.sin(2*Math.PI*(s/43))+Math.sin(2*Math.PI*(s/48))+Math.sin(2*Math.PI*(s/38)))/4'], [lastDate.getDate().toString(), (lastDate.getMonth() + 1).toString(), lastDate.getFullYear().toString()], 300);

              }, false);

              canvasSecond.addEventListener('mouseout', function (evt) {
                  var minimumDate = new Date($("#birthmonth").val() + "-" + $("#birthdate").val() + "-" + $("#birthyear").val());
                  var lastDate = new Date($("#biorhythmmonth").val() + "-" + $("#biorhythmdate").val() + "-" + $("#biorhythmyear").val());
                  var age = dateDiffInDays(minimumDate, lastDate);

                  biopos(false, this, age, [-7, 67],
                      ['Math.sin(2*Math.PI*(s/53))', 'Math.sin(2*Math.PI*(s/43))', 'Math.sin(2*Math.PI*(s/48))', 'Math.sin(2*Math.PI*(s/38))', '(Math.sin(2*Math.PI*(s/53))+Math.sin(2*Math.PI*(s/43))+Math.sin(2*Math.PI*(s/48))+Math.sin(2*Math.PI*(s/38)))/4'], [lastDate.getDate().toString(), (lastDate.getMonth() + 1).toString(), lastDate.getFullYear().toString()], 300);
                  $scope.DateDisplay = $scope.biorhythmdate + "." + $scope.biorhythmmonth + "." + $scope.biorhythmyear;
              }, false);
          }
          var secondaryWaveGraphDataArray = [];

          for (var i = 0; i < dateArrayforWaveGraph.length; i++) {

              var dateObj = new Date(dateArrayforWaveGraph[i]);

              var day = $scope.BiorhythmDate.getDate().toString();
              var month = ($scope.BiorhythmDate.getMonth() + 1).toString();
              var year = $scope.BiorhythmDate.getFullYear().toString();
              var age = dateDiffInDays(minimumDate, dateObj);

              var data = GetDataforSecondaryDate(false, this, age, [-7, 67],
                  ['Math.sin(2*Math.PI*(s/53))', 'Math.sin(2*Math.PI*(s/43))', 'Math.sin(2*Math.PI*(s/48))', 'Math.sin(2*Math.PI*(s/38))', '(Math.sin(2*Math.PI*(s/53))+Math.sin(2*Math.PI*(s/43))+Math.sin(2*Math.PI*(s/48))+Math.sin(2*Math.PI*(s/38)))/4'], [day, month, year], 300);

              //  var ttl = dateObj.getDate().toString() + "." + (dateObj.getMonth() + 1).toString() + "." + dateObj.getFullYear().toString() + " - Physical : " + data.Physical + "%, Emotional : " + data.Emotional + "%, Intellectual : " + data.Intellectual + "%";

              var labl = dateObj.getDate().toString() + "." + (dateObj.getMonth() + 1).toString();
              secondaryWaveGraphDataArray.push({ lable: labl, date: dateObj.toDateString(), BiorhythmDetails: data })
          }

          $scope.SecondaryWaveGraphData = secondaryWaveGraphDataArray;

          $scope.seriesSecondary = ['Intuitive', 'Aesthetic', 'Spiritual', 'Primier', 'Average'];
          var intuitiveDataArr = [];
          var aestheticDataArr = [];
          var spiritualDataArr = [];
          var primierDataArr = [];
          var averageSDataArr = [];
          $scope.labelsSecondary = [];
          secondaryWaveGraphDataArray.forEach(function (ele) {
              intuitiveDataArr.push(ele.BiorhythmDetails.Intuitive);
              aestheticDataArr.push(ele.BiorhythmDetails.Aesthetic);
              spiritualDataArr.push(ele.BiorhythmDetails.Spiritual);
              primierDataArr.push(ele.BiorhythmDetails.Primier);
              averageSDataArr.push(ele.BiorhythmDetails.Average);
              $scope.labelsSecondary.push(ele.lable)
          })


          $scope.dataSecondary = [
               intuitiveDataArr,
               aestheticDataArr,
               spiritualDataArr,
               primierDataArr,
               averageSDataArr
          ];
          $scope.SelectedDataSecondary = {};

          var select = secondaryWaveGraphDataArray.filter(function (ele) {
              return ele.date == $scope.BiorhythmDate.toDateString();
          });
          if (select && select.length > 0) {

              $scope.SelectedDataSecondary.Intuitive = select[0].BiorhythmDetails.Intuitive;
              $scope.SelectedDataSecondary.Aesthetic = select[0].BiorhythmDetails.Aesthetic;
              $scope.SelectedDataSecondary.Spiritual = select[0].BiorhythmDetails.Spiritual;
              $scope.SelectedDataSecondary.Average = select[0].BiorhythmDetails.Average;
          }


          $("#biopri_s").text($scope.DateDisplay);
          $("#biose_s").text($scope.DateDisplay);
          $("#biopri_o0").text($scope.SelectedData.Physical);
          $("#biopri_o1").text($scope.SelectedData.Emotional);
          $("#biopri_o2").text($scope.SelectedData.Intellectual);
          $("#biopri_o3").text($scope.SelectedData.Average);

          $("#biose_o0").text($scope.SelectedDataSecondary.Intuitive);
          $("#biose_o1").text($scope.SelectedDataSecondary.Aesthetic);
          $("#biose_o2").text($scope.SelectedDataSecondary.Spiritual);
          $("#biose_o4").text($scope.SelectedDataSecondary.Average);


          //  }


      }

      $scope.secondaryCheck = function (e) {
          if ($scope.isSecondary) {
              $("#biose").removeAttr('style')
          }
      }


      function setLocalStorage(date, month, year, isbirthdate) {
          if (isbirthdate) {
              localStorage.setItem("birthdate", date);
              localStorage.setItem("birthmonth", month);
              localStorage.setItem("birthyear", year);
          } else {
              localStorage.setItem("biorhythmdate", date);
              localStorage.setItem("biorhythmmonth", month);
              localStorage.setItem("biorhythmyear", year);
          }
      }



  })




