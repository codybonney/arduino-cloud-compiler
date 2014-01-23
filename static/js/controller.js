function Controller($scope) {
	var submitButtonDefault = "Compile Sketch";
	var defaultSketch = "#define LED_PIN 13\n\nvoid setup()\n{\n    pinMode(LED_PIN, OUTPUT);\n}\n\nvoid loop()\n{\n    digitalWrite(LED_PIN, HIGH);\n    delay(100);\n    digitalWrite(LED_PIN, HIGH);\n    delay(900);\n}";

	var $compileTime = $("#compileTime");

	$scope.status = "waiting";
	$scope.sketch = defaultSketch;
	$scope.compiled = "";
	$scope.submitButton = submitButtonDefault;

	$scope.compile = function() {
		$scope.status = "compiling";
		$scope.submitButton = "Compiling...";
		$scope.compiled = "Compiling...";

		var compileTimeStart = new Date().getTime();

		$.ajax({
			type: "POST",
			url: "./compile",
			data: {
				sketch: $scope.sketch
			}
		})
		.success(function(hex) {
			var compileTimeEnd = new Date().getTime();
			$scope.compiled = hex;
			$compileTime.html('Compiled sketch in ' + (compileTimeEnd - compileTimeStart) + 'ms');

			$scope.status = "success";
			$scope.submitButton = submitButtonDefault;
			$scope.$apply();
		})
		.error(function(msg) {
			$scope.compiled = "error";
			$scope.status = "error";
			$scope.submitButton = submitButtonDefault;
			$scope.$apply();
		});
	};

}