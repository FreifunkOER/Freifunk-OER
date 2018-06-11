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

.directive('activeChapterMatch',[

	'$rootScope',
	'$document',

	function($rootScope, $document){
		return {
			restrict: 'A',

			link: function(scope, element, attrs){

				var regex = new RegExp(attrs.activeChapterMatch)

				$document.on('scroll', function(){
					element.toggleClass('active-chapter', regex.exec($rootScope.activeChapter))
				})

			}
		}
	}

])

.directive('heroSpacer',[

	'$document',
	'$timeout',

	function($document, $timeout){
		return {
			restrict: 	'AE',
			scope: 		false,

			link: function(scope, element, attrs){
				var html = $document.find('html')

				function checkHero(){
						var hero_out = element[0].getBoundingClientRect().bottom <= 0

						html.toggleClass('hero-in', !hero_out)
						html.toggleClass('hero-out', hero_out)
				}

				$timeout(checkHero, 500)

				$document.on('scroll', function(){
					window.requestAnimationFrame(checkHero)
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
			if($rootScope.narrow){
				window.requestAnimationFrame(function(){
					if(scheduledApply) $timeout.cancel(scheduledApply)

					scheduledApply = 	$timeout(function(){
											$rootScope.show = {}
										}, 100)
				})
			}
		})
	

		$rootScope.show.toc = true


		$rootScope.goBack = function() {
		    window.history.back()
		}

		var last_scroll_pos

		$rootScope.toggleTOC = function(toggle){


			$rootScope.show.toc = 	toggle === undefined
									?	!$rootScope.show.toc
									:	toggle


			// if($rootScope.show.toc){
			// 	last_scroll_pos = html[0].scrollTop

			// }else{
			// 	if(last_scroll_pos !== undefined)
			// 	html[0].scrollTop = last_scroll_pos
			// }
		}

		$rootScope.toggleLang = function(){
			$rootScope.show.lang = !$rootScope.show.lang
		}

		//checking if page has scroll far enough to slim down the header:

		var body 	= $document.find('body'),
			header 	= $document.find('header'),
			html	= $document.find('html')

		$document.on('scroll', function(){
			window.requestAnimationFrame(function(){
				var padding_top	= parseInt(getComputedStyle(body[0]).getPropertyValue('padding-top'))

				header.toggleClass('slim', padding_top + document.body.getBoundingClientRect().top < 0)

			})
		})



		//check which chapters are in view:
		
		
		$document.on('scroll', function(){

			window.requestAnimationFrame(function(){

				var chapter = '',
					last_top = undefined

				document.querySelectorAll('[id]').forEach(function(element){
					var cn = (element.getAttribute('id')||'').match(/chapter-.*/)

					cn = cn && cn[0]

					if(!cn) return null

					var rect 		= element.getBoundingClientRect()
  					var viewHeight 	= Math.max(document.documentElement.clientHeight, window.innerHeight)



  					if(rect.top 	> viewHeight) 	return null
  					if(rect.bottom 	< 0)			return null

  					if(last_top === undefined || (rect.top > last_top)){
  						last_top = rect.top
  						chapter = cn
  					}

				})

				//there is no $apply here, i dont want to call $apply a hundret times during a scroll. toc will pull the info form $rootScope on its own on scroll
				$rootScope.activeChapter = chapter
			})
		})




		function getScrollBarWidth(){
			var div	= 	angular.element('<div></div>')
						.css({
							'width': 		'100px',
							'height':		'100px',
							'position':		'absolute',
							'overflow-y':	'scroll'
						})

			angular.element(document.getElementsByTagName('body')[0]).append(div)

			scrollbar_width	=	(100-div[0].clientWidth)

			div.remove()
		}

		if(getScrollBarWidth() == 0){
			$rootScope.no_scrollbar_width = true
		}



		//check window width and switch layout:

		var threshold_px	= undefined 

		function adjustContentWidth(){		
			var width 			= document.body.getBoundingClientRect().width,
				rem				= parseInt(getComputedStyle(html[0]).getPropertyValue('font-size')),
				threshold_rem	= 60, // switch if content width < 60 rem,
				narrow_rem		= 20	

			threshold_px = threshold_px || threshold_rem * rem

			//if 60rem of default font-size won't fit on the screen
			// add class .narrow and set font-size on html,
			// so that the content's width is allways 30rem

			if(threshold_px > width){
				$rootScope.narrow = true

				if(!$rootScope.toc_hidden_on_start){
					$rootScope.show.toc 			= false
					$rootScope.toc_hidden_on_start 	= true
				}

				html.addClass('narrow')
				html.removeClass('wide')
				html.css('fonrt-size', (width/narrow_rem) + 'px')
			} else {
				$rootScope.narrow = false
				html.addClass('wide')
				html.removeClass('narrow')
				html.css('font-size', 'inherit')
			}
			$rootScope.$apply()
		}
		
		adjustContentWidth()
		angular.element($window).on('resize', adjustContentWidth)

		$timeout(adjustContentWidth, 500)
	}
])		
