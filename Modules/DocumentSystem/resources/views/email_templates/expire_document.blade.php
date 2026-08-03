<!DOCTYPE html>
<html>
  <head>
    <title>Expire Document</title>
    <style>
        table,
        td,
        div,
        h1,
        p {
            font-family: Arial, sans-serif;
        }
        table {
            border-collapse: collapse;
            width: 100%;
        }
        th, td {
            text-align: left;
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #fff;
            color: white;
        }
        body {
            padding: 20px 100px;
            margin: 0;
            word-spacing: normal;
            background-color: #efefef;
        }
        .table-document thead tr th,
        .table-document tbody tr td {
            padding-left: 30px;
            color: #000;
        }
        @media screen and (max-width: 576px) {
            body {
                padding: 20px !important;
            }
            .table-document thead tr th,
            .table-document tbody tr td {
                padding-left: 10px !important;
            }
        }
    </style>
  </head>
  <body>
    <table role="presentation">
        <tr>
            <td style="padding:40px 30px 30px 30px;text-align:center;font-size:24px;font-weight:bold;">
                <a href="#" style="text-decoration:none;">
                    <img
                        src="{{ public_path('/images/logo.png') }}" width="80" alt="Logo"
                        style="width:88px;max-width:80%;height:auto;border:none;text-decoration:none;color:#ffffff;">
                    <h3
                        style="margin-top:8px;margin-bottom:0px;font-size:26px;font-weight:bold;color: #000;text-align:center;">
                        {{ config('app.name') }}</h3>
                </a>
            </td>
        </tr>
    </table>
    <table role="presentation" style="background: #fff; border: none;">
        <tr style="border:none;">
            <td style="padding:20px 15px 15px 15px;text-align:center;font-size:24px;font-weight:bold;border:none;">
                <h3
                    style="margin-top:0;margin-bottom:0;font-size:18px;line-height:34px;font-weight:bold;letter-spacing:-0.02em;">
                    @lang('global.expire_document')</h3>
            </td>
        </tr>
        <tr style="border:none;">
            <td style="padding:10px;text-align:left;font-size:14px;font-weight:bold;border:none;">
                <p style="padding:0;margin:0;">@lang('global.list_document_expire'):</p>
            </td>
        </tr>
    </table>
    <table style="background: #fff;" class="table-document">
      <thead>
        <tr>
          <th style="color: #000; padding-left: 30px;">@lang('global.title')</th>
          <th style="color: #000; padding-left: 30px;">@lang('global.id_document')</th>
        </tr>
      </thead>
      <tbody>
        @foreach ($documents as $document)
            <tr>
                <td style="padding-left: 30px;">{{ $document['title'] }}</td>
                <td style="padding-left: 30px;">{{ $document['document_number'] }}</td>
            </tr>
        @endforeach
      </tbody>
    </table>

    <table role="presentation"
        style="width:100%;border:none;border-spacing:0;text-align:center;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">
        <tr>
            <td
                colspan="2"
                style="padding:30px;text-align:center;font-size:16px;background-color:#222;color:#cccccc;">
                <p style="margin:0;font-size:16px;line-height:30px;text-align:center;"><span>©</span> {{ date('Y') }}
                    <a style="color: #fff;text-decoration: underline;" href="#">{{ config('app.name') }}</a>
                    {{-- @if(!empty(setting('site.site_footer'))) {!! setting('site.site_footer') !!} @endif

                    <br><a
                        class="unsub" href="{{ eventmie_url() }}"
                        style="color:#cccccc;font-size: 10px;">@lang('eventmie-pro::em.unsubscribe')</a></p> --}}
            </td>
        </tr>
    </table>
  </body>
</html>
