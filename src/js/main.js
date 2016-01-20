/* Main Js */
/****************************************************
 > File Name    : main.js
 > Author       : Cole Smith
 > Mail         : tobewhatwewant@gmail.com
 > Github       : whatwewant
 > Created Time : 2015年09月02日 星期三 11时51分40秒
 ****************************************************/

/*********************************************
* JSON DATA FORMAT
* URL: http://shanbay.com/api/v1/bdc/search/?word=short&_=1441579792216
**********************************************
{
  "msg": "SUCCESS",
  "status_code": 0,
  "data": {
    "pronunciations": {
      "uk": "ʃɔːt",
      "us": "ʃɔːrt"
    },
    "en_definitions": {
      "a": [
        "primarily temporal sense; indicating or being or seeming to be limited in duration",
        "(primarily spatial sense) having little length or lacking in length",
        "low in stature; not tall"
      ],
      "s": [
        "not sufficient to meet a need",
        "less than the correct or legal or full amount often deliberately so",
        "lacking foresight or scope"
      ],
      "r": [
        "quickly and without warning",
        "without possessing something at the time it is contractually sold",
        "clean across"
      ],
      "v": [
        "cheat someone by not returning him enough money",
        "create a short circuit in"
      ],
      "n": [
        "the location on a baseball field where the shortstop is stationed",
        "accidental contact between two points in an electric circuit that have a potential difference",
        "the fielding position of the player on a baseball team who is stationed between second and third base"
      ]
    },
    "audio_addresses": {
      "uk": [
        "http://words-audio.oss.aliyuncs.com/uk%2Fs%2Fsh%2Fshort.mp3",
        "http://words-audio.cdn.shanbay.com/uk/s/sh/short.mp3"
      ],
      "us": [
        "http://words-audio.oss.aliyuncs.com/us%2Fs%2Fsh%2Fshort.mp3",
        "http://words-audio.cdn.shanbay.com/us/s/sh/short.mp3"
      ]
    },
    "uk_audio": "http://media.shanbay.com/audio/uk/short.mp3",
    "conent_id": 5464,
    "audio_name": "short",
    "cn_definition": {
      "pos": "",
      "defn": "adj. 短的,矮的,短暂的 \nn. 短裤\nadv. 短暂地;突然地"
    },
    "num_sense": 1,
    "content_type": "vocabulary",
    "id": 5464,
    "retention": 5,
    "definition": " adj. 短的,矮的,短暂的 \nn. 短裤\nadv. 短暂地;突然地",
    "content_id": 5464,
    "target_retention": 5,
    "en_definition": {
      "pos": "a",
      "defn": "primarily temporal sense; indicating or being or seeming to be limited in duration; (primarily spatial sense) having little length or lacking in length; low in stature; not tall"
    },
    "object_id": 5464,
    "learning_id": 140527464,
    "content": "short",
    "pron": "ʃɔːrt",
    "pronunciation": "ʃɔːrt",
    "audio": "http://media.shanbay.com/audio/us/short.mp3",
    "us_audio": "http://media.shanbay.com/audio/us/short.mp3"
  }
}
****************************************************
*  JSON DATA FORMATOR END
****************************************************/

    var WordHelper = {
        popover_id: "#wordhelper_popover",
        popover_id_name: "wordhelper_popover",

        // get Offset depends on its direction
        getOffset: function(dir, e) {
                var offset = 0;
                switch (dir.toLowerCase()) {
                    case 'left':
                        offset = e.offsetLeft;
                        break;
                    case 'top':
                        offset = e.offsetTop;
                        break;
                }

                if (! e.offsetParent)
                    return offset;
                return (offset + this.getOffset(dir, e.offsetParent));
            },

        setPopoverPosition: function (left, top) {
                $(wordhelper_popover).css({
                    position: 'absolute',
                    left: left,
                    top: top
                });
            },

        getSelectionOffset: function (callback) {
                var left = window.innerWidth / 2;
                var top = window.innerHeight / 2;
                var selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    var range = selection.getRangeAt(0);
                    var dummy = document.createElement('span');
                    range.insertNode(dummy);
                    left = this.getOffset('left', dummy) - 50 - dummy.offsetLeft + $(dummy).position().left;
                    top = this.getOffset('top', dummy) + 25 - dummy.offsetTop + $(dummy).position().top;
                    dummy.remove();
                    window.getSelection().addRange(range);
                }
                callback(left, top);
            },
        hidePopover: function () {
                $(this.popover_id).remove();
            },
        playAudio: function (audio_url) {
                if (audio_url) {
                    new Howl({
                        urls: [audio_url]
                    }).play();
                }
            },
        transformDefinition: function (definitionArray) {
                return '  <div class="popover-definition">' +
                        definitionArray.map(function (e, index, array) {
                            return '<div class="popover-each-definition">' +
                                array[index] +
                                '</div>';
                        }).join('') +
                        '  </div>';
            },
        popover: function (allData) {
                var data = allData.wordhelper;
                var webster = allData.webster;
                var defs = "";
                var html = '<div id=' +
                    this.popover_id_name +
                    '><div class="popover-inner"><h3 class="popover-title">';
                // loading notification
                if (true === data.loading) {
                    html += '<p><span class="word">' +
                        data.msg +
                        '</span></p>';
                } else {
                    if (1 == data.status_code || ! data.data) { // word doesnot exist
                        if (undefined === webster || webster.term === "") {
                            html += '未找到单词</h3></div>';
                        }
                        else {
                            html += '<p><span class="word">' +
                                webster.term +
                                '</span></p></h3>' +
                                '<div class="popover-content"><p>' +
                                webster.defs +
                                '</p></div>';
                        }
                    } else { // word exists, but no recording
                        html += '<p><span class="word">' + data.data.content +
                            '</span><small class="pronunciation">' +
                            (data.data.pron ? '['+data.data.pron+']' : '') +
                            '</small></p>';
                        if (window.location.protocol.indexOf('https') < 0) {
                            html += '<a href="#" class="speak uk">UK<i class="icon icon-speak"></i></a>' +
                                '<a href="#" class="speak us">US<i class="icon icon-speak"></i></a></h3>';
                        }
                        else {
                            html += '</h3>';
                        }

                        html += '<div class="popover-content">' +
                            this.transformDefinition(data.data.definition.split('\n')) +
                            '</div>';
                    }
                }

                html += '</div></div>';
                $(this.popover_id).remove();
                $('body').append(html);

                this.getSelectionOffset(function (left, top) {
                    this.setPopoverPosition(left, top);
                }.bind(this));

                $(this.popover_id + ' .speak.us').click (function (e) {
                    e.preventDefault();
                    var audio_url = 'http://media.shanbay.com/audio/us/' + data.data.content + '.mp3';
                    this.playAudio(audio_url);
                }.bind(this));

                $(this.popover_id + ' .speak.uk').click (function (e) {
                    e.preventDefault();
                    var audio_url = 'http://media.shanbay.com/audio/uk/' + data.data.content + '.mp3';
                    this.playAudio(audio_url);
                }.bind(this));

                $('html').click(function () {
                    this.hidePopover();
                }.bind(this));

                $('body').on('click', this.popover_id, function (e) {
                    // e.stopPropagation();
                });
            }
    };

;(function ($) {
    $(document).ready(function () {
        $(document).on("dblclick", function () {
            var selection = document.getSelection();
            var selectedDataRange = selection.getRangeAt(0);
            if (! selectedDataRange) {
                return ;
            }
            var selectedData = selectedDataRange.toString();
            if (! selectedData || ! (new RegExp(/^[a-z]+$/i).test(selectedData))) {
                return ;
            }
            selectedData = selectedData.toLowerCase();
            WordHelper.popover({
                wordhelper: {
                    loading: true,
                    msg: '正在查询...',
                }
            });
            $.ajax({
                url: "http://shanbay.com/api/v1/bdc/search/?word=" + selectedData + "&_="+ (new Date()).getTime(),
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    WordHelper.popover({
                        wordhelper: {
                            loading: false,
                            data: data.data,
                            status_code: data.status_code,
                            msg: data.msg
                        }
                    });
                }.bind(selection),
                error: function (msg) {
                    console.log("Word Helper Search Error " + msg.toString());
                }
            });
        });
    });
})($);
