function Controller($scope) {
	var defaultSketch = "#define LED_PIN 13\n\nvoid setup()\n{\n    pinMode(LED_PIN, OUTPUT);\n}\n\nvoid loop()\n{\n    digitalWrite(LED_PIN, HIGH);\n    delay(100);\n    digitalWrite(LED_PIN, HIGH);\n    delay(900);\n}";

	$scope.compiling = false;
	$scope.compileTime = "";
	$scope.status = "waiting";
	$scope.sketch = defaultSketch;
	$scope.compiled = "";

	$scope.compile = function() {
		$scope.compiling = true;
		$scope.status = "compiling";
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
			$scope.compiling = false;
			var compileTimeEnd = new Date().getTime();
			$scope.compiled = hex;
			$scope.compileTime = 'Compiled sketch in ' + (compileTimeEnd - compileTimeStart) + 'ms';
			$scope.status = "success";
			$scope.$apply();
		})
		.error(function(msg) {
			$scope.compiling = false;
			$scope.compiled = "error";
			$scope.status = "error";
			$scope.$apply();
		});
	};

	$scope.$watch('compiling', function() {
		if($scope.compiling) {
			$scope.submitButton = "Compiling...";
		} else {
			$scope.submitButton = "Compile Sketch";
		}
	});
}