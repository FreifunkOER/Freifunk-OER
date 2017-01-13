angular.module('FreifunkOER',
	[
		//
	]
)

.run([

	'$rootScope',
	'$document',
	'$window',
	'$timeout',

	function($rootScope, $document, $window, $timeout){
		$rootScope.show = {}

		var scheduledApply = undefined

		angular.element(window).on('resize', function(){ 
			window.requestAnimationFrame(function(){
				if(scheduledApply) $timeout.cancel(scheduledApply)

				scheduledApply = 	$timeout(function(){
										$rootScope.show = {}
									}, 100)
			})
		})
	}
])		
