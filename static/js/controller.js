function Controller($scope) {
	var submitButtonDefault = "Compile Sketch";
	var defaultSketch = "#define LED_PIN 13\n\nvoid setup()\n{\n    pinMode(LED_PIN, OUTPUT);\n}\n\nvoid loop()\n{\n    digitalWrite(LED_PIN, HIGH);\n    delay(100);\n    digitalWrite(LED_PIN, HIGH);\n    delay(900);\n}";

	var $compileTime = $("#compileTime");
	var $sketch = $("#sketch");
	var $compiled = $("#compiled");

	$scope.status = "waiting";
	$scope.sketch = defaultSketch;
	$scope.submitButton = submitButtonDefault;

	$scope.compile = function() {
		$scope.status = "compiling";
		$scope.submitButton = "Compiling...";
		$compiled.val("");

		var compileTimeStart = new Date().getTime();

		$.ajax({
			type: "POST",
			url: "./compile",
			data: {
				sketch: $sketch.val()
			}
		})
		.success(function(hex) {
			var compileTimeEnd = new Date().getTime();
			$compiled.val(hex);
			$compileTime.html('Compiled sketch in ' + (compileTimeEnd - compileTimeStart) + 'ms');

			$scope.status = "waiting";
			$scope.submitButton = submitButtonDefault;
			$scope.$apply();
		});
	};

}