Open = function (pageStr, ext, win) {
	var page = JSON.TryParse(pageStr);
	if (!page)
		page = {U: pageStr, T: 0};
	if (typeof ext == 'string' && ext)
		ext = JSON.TryParse(ext, ext);
	if (typeof ext == 'object')
	{
		page = $.extend(page, ext);
		delete ext.T;
		delete ext.W;
		delete ext.H;
	}

    var sonuc = [];
    for (var e in ext)
    {
        if (typeof ext[e] == 'object')
            ext[e] = -1;
        var param = '/' + ext[e];
        if (sonuc.indexOf(param) < 0)
            sonuc.push(param);
    }

	var url = page.U + sonuc;
	win = win || window;
	if (page.T == 1)
		win = OpenNewWindow(url, page.N, page.W, page.H);
	else
		win.Page.Load(url);
	if (page.W == 'full' || page.W == 0)
		win.moveTo(0, 0);
	win.blur();
	win.focus();
	return win;
};

OpenNewWindow = function (page, wname, wi, he, extra) {
	if (page.indexOf(window.location.pathname) < 0 &&
			page.indexOf('http') < 0 && page[0] != '?' &&
			page.indexOf('index.php') < 0 &&
			!page.match(/\.([a-z0-9]{3,4})$/i))
		page = GetUrl(page);
	var l = 0;
	var t = 0;
	if (typeof wi == "undefined")
		wi = 500;
	if (typeof he == "undefined")
		he = 500;
	if (wi == 'full' || wi == 0)
	{
		wi = window.screen.availWidth;
		l = 0;
	} else
		l = (window.screen.availWidth - wi) / 2;

	if (he == 'full' || he == 0)
	{
		he = window.screen.availHeight;
		t = 0;
	} else
		t = (window.screen.availHeight - he) / 2;

	if (typeof extra == "undefined")
		extra = "menubar=1,scrollbars=1,resizable=1";
	var wnd = window.open(page, wname,
			'width=' + wi + ',' +
			'height=' + he + ',' +
			'left=' + l + ',' +
			'top=' + t + ',' +
			extra
			);
	if (wnd)
	{
		wnd.blur();
		wnd.focus();
	}
	return wnd;
};

JSON.TryParse = function (str, defaultObj) {
	try {
		str = String.CleanMsWordChars(str, true);
		obj = JSON.parse(str);
		return obj;
	} catch (e) {
		console.log('JSON.TryParse error: ' + e);
		if (typeof defaultObj == "undefined")
			defaultObj = null;
		return defaultObj;
	}
};

$.ajaxSetup(
    {
        headers: {
            'X-CSSRF_TOKEN' : $('meta[name="csrf-token"]').attr('content')
        }
    });

    var modalWrap = null;
    UseSwal = true;
    UseSwalV2 = false;
    function ShowInfo (msg, okCallback, icon = '')
    {
        CallSwal({
            title: 'Bilgi',
            text: msg,
            type: icon,
            confirmButtonText: 'Ok'
            }, okCallback);
    };

    function ShowWarning (msg, okCallback, icon = '')
    {
        CallSwal({
            title: 'Uyarı',
            text: msg,
            type: icon,
            confirmButtonText: 'Ok'
            }, okCallback);
    };

    function ShowError (msg, okCallback, icon = '')
    {
        CallSwal({
            title: 'Hata',
            text: msg,
            type: icon,
            confirmButtonText: 'Ok'
            }, okCallback);
    };

    function CallSwal(options, callback)
    {
        if (typeof swal != 'function' || ! UseSwal)
            return false;
        if (typeof swal.fire == 'function')
        {
            options.html = options.text;
            delete options.text;
            options.icon = options.type;
            if (options.type == 'input')
            {
                options.input = 'text';
                options.inputValidator = function(value){
                    if (value == '')
                        return options.inputErrorMessage;
                };
            }
            swal.fire(options).then(callback);
        }
        else if(UseSwalV2)
        {
            options.html = options.text;
            delete options.text;
            swal(options).then(callback);
        }
        else
        {
            options.html = true;
            swal(options, callback);
        }
        return true;
    }

    const ShowBSDialog = (divId, callback) =>
    {
        var div = $('#' + divId);
        var title = $('#' + divId).attr('title');
        var modalId = divId + '_modal';

        var modal = $('#' + modalId);

        if (modal.length > 0)
		    modal.remove();

        modal = $([
            '<div class="modal fade" id="'+modalId+'" role="dialog">',
            '    <div class="modal-dialog">',
            '        <div class="modal-content" id="Main-Modal">',
            '            <div class="modal-header">',
            '                <h4>'+title+'</h4>',
            '            </div>',
            '            <div class="modal-body">',
                         $(div).html(),
            '            </div>',
            '            <div class="modal-footer justify-content-between">',
            '              <button type="button" class="btn btn-default" data-dismiss="modal">Kapat</button>',
            '              <button type="button" class="btn btn-primary save">Kaydet</button>',
            '            </div>',
            '        </div>',
            '    </div>',
            '</div>',
            ].join("\n")).appendTo('body');
            modal.modal({"backdrop": "static"});

            $(modal).find('BUTTON.save').click(function(){
                var sonuc = true;
                if (typeof callback == "function")
                    sonuc = callback();
                if (sonuc)
                    modal.modal('hide');
            });
    }

      function JsDataTable(tableId)
      {
          var obj = {
            //colReorder: true,
            paging: true,
            autoWidth: false,
            responsive:true,
            lengthMenu: [[5,10,25,50,100, -1], [5,10,25,50,100, "All"]],
            info:true,
            "language": {
                "emptyTable": "Gösterilecek ver yok.",
                "processing": "Veriler yükleniyor",
                "sDecimal": ".",
                "sInfo": "Toplam _TOTAL_ kayıt, _START_ - _END_ arasındaki kayıtlar gösteriliyor",
                "sInfoFiltered": "(_MAX_ kayıt içerisinden bulunan)",
                "sInfoPostFix": "",
                "sInfoThousands": ".",
                "sLengthMenu": "Sayfada _MENU_ Kayıt",
                "sLoadingRecords": "Yükleniyor...",
                "sSearch": "Ara:",
                "sZeroRecords": "Eşleşen kayıt bulunamadı",
                "oPaginate": {
                    "sFirst": "İlk",
                    "sLast": "Son",
                    "sNext": "Sonraki",
                    "sPrevious": "Önceki"
                },
                "oAria": {
                    "sSortAscending": ": artan sütun sıralamasını aktifleştir",
                    "sSortDescending": ": azalan sütun sıralamasını aktifleştir"
                },
                "select": {
                    "rows": {
                        "_": "%d kayıt seçildi",
                        "0": "",
                        "1": "1 kayıt seçildi"
                    }
                }
            },
            dom: 'lBfrtip',
            buttons: [
                'excel', 'csv', 'pdf'
            ],
          };
          var table = $('#'+tableId).DataTable(obj);

          // lenght
          var tableWrapper = `<div class='text-white table_lenght'
                                      style='width:100%; background:#337ab7;
                                      border-radius:3px; height:40px; display: flex;
                                      align-items: center;'>
                              </div>`;
          $('#'+tableId).parent('div').prepend(tableWrapper);

          $('.table_lenght').append($('.dt-buttons'));
          $('.dt-buttons').attr('style','color:white; position: absolute; left: 2; margin-top:3px;');
          var dtCss = {
              'color':'white',
              'background-color':'#5bc0de',
              'border-radius':'3px',
              'border-color':'#46b8da',
              'margin':'2px',
              'width':'50px',
              'font-size': '10px'
          }
          $(".buttons-html5").css(dtCss);

          $('.table_lenght').append($('.dataTables_length'));
          $('.dataTables_length').attr('style','color:white; position: absolute; right: 0; margin: auto; margin-top:8px; margin-right:5px;');

          //search input unu taşıdık
          $('.table_lenght').parent('div').prepend($('.dataTables_filter input'));
          $('.dataTables_wrapper input').css({'width':'100%', 'margin-bottom':'5px', 'border-radius':'3px'});

           $('.dataTables_filter').remove();

            $(window).resize(function(){
                if ($(window).width() <= 1024)
                    $(".dt-buttons").hide();
                else
                    $(".dt-buttons").show();

            });

          return table;
      }

      function AjaxIslem(url, GetData, CallBackFunction, methot = 'GET')
      {
          if (methot != 'GET')
              GetData._token = $('meta[name="csrf-token"]').attr('content');

          $.ajax({
              type : methot,
              url : url,
              data : GetData,
              success : function (e) {
                  if (typeof CallBackFunction == "function")
                      CallBackFunction(e);
                  else
                      console.log(CallBackFunction);
              }
          });

      }

      function PageCloseAndRefresh()
      {
        window.close();
        window.opener.location.reload();
      }

      function PageReload()
      {
        window.location.reload();
      }
