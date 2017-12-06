angular.module('FreifunkOER',
	[
		//
	]
)

.directive('enlargeOnClick', [

	function(){
		return {
			restrict: 'A',

			link: function(scope, element){
				element.on('click', function(){
					element.toggleClass('full-screen')
				})
			}
		}
	}

])

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
