<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>
    <table>
        <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th colspan="4"
                style="color: #000000;font-weight:bolder;vertical-align:center;text-align:center;font-size:20pt;">DAFTAR
                INDUK DOKUMEN INTERNAL</th>
        </tr>
        <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th>
                <b>Update:</b> {{ date('d/m/Y') }}
            </th>
        </tr>
    </table>
    <table>
        <tr style="border: 1px;border-color: #0000;">
            <th></th>
            <th></th>
            <th></th>
            <th rowspan="2"
                style="background-color: #00B050;color: #ffffff;vertical-align: center;font-size: 11pt;font-weight:bold;text-align: center; border: 1px solid #000; border-right: none;">
                NO</th>
            <th rowspan="2"
                style="background-color: #00B050;color: #ffffff;vertical-align: center;font-size: 11pt;font-weight:bold;text-align: center; border: 1px solid #000;border-right: none;">
                NOMOR DOKUMEN</th>
            <th rowspan="2"
                style="background-color: #00B050;color: #ffffff;vertical-align: center;font-size: 11pt;font-weight:bold;text-align: center; border: 1px solid #000; border-right: none;">
                NAMA DOKUMEN</th>
            <th rowspan="2"
                style="background-color: #00B050;color: #ffffff;vertical-align: center;font-size: 11pt;font-weight:bold;text-align: center; border: 1px solid #000; border-right: none;">
                PENANGGUNG JAWAB</th>
            <th colspan="2"
                style="background-color: #00B050;color: #ffffff;vertical-align: center;font-size: 11pt;font-weight:bold;text-align: center; border: 1px solid #000; border-right: none;">
                STATUS DOKUMEN</th>
            @if ($revision_col > 0)
                <th colspan="{{ $revision_col }}"
                    style="background-color: #00B050;color: #ffffff;vertical-align: center;font-size: 11pt;font-weight:bold;text-align: center; border: 1px solid #000;">
                    TANGGAL REVISI</th>
            @endif
        </tr>
        <tr>
            <th></th>
            <th></th>
            <th></th>
            <th
                style="background-color: #00B050;color: #ffffff;vertical-align: center;font-size: 11pt;font-weight:bold;text-align: center; border: 1px solid #000;">
                REVISI</th>
            <th
                style="background-color: #00B050;color: #ffffff;vertical-align: center;font-size: 11pt;font-weight:bold;text-align: center; border: 1px solid #000;">
                TANGGAL PEMBUATAN</th>
            @for ($a = 0; $a < $revision_col; $a++)
                <th
                    style="background-color: #00B050;color: #ffffff;vertical-align: center;font-size: 11pt;font-weight:bold;text-align: center; border: 1px solid #000;">
                    REVISI {{ $a + 1 }}</th>
            @endfor
        </tr>
        @foreach ($data as $key => $item)
            <tr class="tr-parent">
                <td></td>
                <td></td>
                <td></td>
                <td style="background-color: #A9D08E; border:1px solid #000; border-right: none;">{{ $key + 1 }}
                </td>
                <td style="background-color: #A9D08E; border:1px solid #000; border-right: none;">
                    {{ $item['document_number'] }}</td>
                <td style="background-color: #A9D08E; border:1px solid #000; border-right: none;">{{ $item['title'] }}
                </td>
                <td
                    style="background-color: #A9D08E; border:1px solid #000; border-right: none; vertical-align:center; text-align:center;">
                    {{ $item['pic'] }}</td>
                <td
                    style="background-color: #A9D08E; border:1px solid #000; border-right: none; vertical-align:center; text-align:center;">
                    {{ $item['revision'] }}</td>
                <td
                    style="background-color: #A9D08E; border:1px solid #000; border-right: none; vertical-align:center; text-align:center;">
                    {{ $item['first_doc_created'] }}</td>
                @for ($b = 0; $b < $revision_col; $b++)
                    <td
                        style="background-color: #A9D08E; border:1px solid #000; vertical-align:center; text-align:center;">
                        {{ isset($item['revision_date'][$b]) ? $item['revision_date'][$b] : '' }}</td>
                @endfor
            </tr>
            @if ($item['children'])
                @foreach ($item['children'] as $k => $child)
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style="border:1px solid #000; border-right: none;"></td>
                        <td style="border:1px solid #000; border-right: none;">{{ $child['document_number'] }}</td>
                        <td style="border:1px solid #000; border-right: none;">{{ $child['title'] }}</td>
                        <td
                            style="border:1px solid #000; border-right: none; vertical-align:center; text-align:center;">
                            {{ $child['pic'] }}</td>
                        <td
                            style="border:1px solid #000; border-right: none; vertical-align:center; text-align:center;">
                            {{ $child['revision'] }}</td>
                        <td
                            style="border:1px solid #000; border-right: none; vertical-align:center; text-align:center;">
                            {{ $child['first_doc_created'] }}</td>
                        @for ($c = 0; $c < $revision_col; $c++)
                            <td style="border:1px solid #000; vertical-align:center; text-align:center;">
                                {{ isset($child['revision_date'][$c]) ? $child['revision_date'][$c] : '' }}</td>
                        @endfor
                    </tr>
                @endforeach
            @endif
        @endforeach
    </table>
</body>

</html>
