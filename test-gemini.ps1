$headers = @{
    "Content-Type" = "application/json"
    "X-goog-api-key" = "AIzaSyDuGk6eephMZOla7-NjvQnuV4NLlHTDuyA"
}

$body = @{
    contents = @(
        @{
            parts = @(
                @{
                    text = "Say hello"
                }
            )
        }
    )
} | ConvertTo-Json -Depth 10

$response = Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent" -Method Post -Headers $headers -Body $body
$response | ConvertTo-Json -Depth 10
